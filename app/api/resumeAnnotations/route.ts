import { NextRequest, NextResponse } from 'next/server';

function extractPdfFromMultipart(buffer: ArrayBuffer): ArrayBuffer | null {
  const text = Buffer.from(buffer).toString('binary');
  
  // Look for PDF marker
  const pdfStart = text.indexOf('%PDF');
  if (pdfStart === -1) {
    console.log('[Annotation] No PDF marker found in response');
    return null;
  }

  // Look for EOF marker
  const eofMarker = '%%EOF';
  const eofIndex = text.indexOf(eofMarker, pdfStart);
  const pdfEnd = eofIndex !== -1 ? eofIndex + eofMarker.length : text.length;

  // Extract PDF content
  const pdfContent = text.substring(pdfStart, pdfEnd);
  return Buffer.from(pdfContent, 'binary').buffer;
}

function extractJsonFromMultipart(buffer: ArrayBuffer): Record<string, unknown> | null {
  const text = Buffer.from(buffer).toString('utf-8');
  
  // Find the boundary marker
  const boundaryMatch = text.match(/--[A-Za-z0-9_-]+/);
  if (!boundaryMatch) {
    console.log('[Annotation] No multipart boundary found');
    return null;
  }
  
  const boundary = boundaryMatch[0];
  console.log(`[Annotation] Found boundary: ${boundary}`);
  
  // Split by boundary to get individual parts
  const parts = text.split(boundary);
  console.log(`[Annotation] Found ${parts.length} parts in multipart message`);
  
  // Look for the JSON part
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    
    // Log each part for debugging
    const partPreview = part.substring(0, 150).replace(/\n/g, '\\n').replace(/\r/g, '\\r');
    console.log(`[Annotation] Part ${i} preview: ${partPreview}...`);
    
    // Check if this part contains JSON content - look for json in headers (case-insensitive)
    const lowerPart = part.toLowerCase();
    if (lowerPart.includes('json')) {
      console.log(`[Annotation] Found JSON part at index ${i}`);
      
      // Try to find header/body separator (could be \n\n or \r\n\r\n)
      let headerEndIndex = part.indexOf('\r\n\r\n');
      let separatorLength = 4;
      
      if (headerEndIndex === -1) {
        headerEndIndex = part.indexOf('\n\n');
        separatorLength = 2;
      }
      
      if (headerEndIndex === -1) {
        console.log('[Annotation] No header separator found in JSON part');
        continue;
      }
      
      console.log(`[Annotation] Found header separator at index ${headerEndIndex}`);
      
      const content = part.substring(headerEndIndex + separatorLength).trim();
      
      // Remove any trailing boundary markers or whitespace
      const crlfBoundaryIndex = content.indexOf('\r\n--');
      const lfBoundaryIndex = content.indexOf('\n--');
      
      let boundaryPos = -1;
      if (crlfBoundaryIndex !== -1 && lfBoundaryIndex !== -1) {
        boundaryPos = Math.min(crlfBoundaryIndex, lfBoundaryIndex);
      } else if (crlfBoundaryIndex !== -1) {
        boundaryPos = crlfBoundaryIndex;
      } else if (lfBoundaryIndex !== -1) {
        boundaryPos = lfBoundaryIndex;
      }
      
      const cleanContent = (boundaryPos !== -1 ? content.substring(0, boundaryPos) : content).trim();
      
      console.log(`[Annotation] Extracted content length: ${cleanContent.length}`);
      console.log(`[Annotation] Content preview: ${cleanContent.substring(0, 150)}...`);
      
      if (!cleanContent) {
        console.log('[Annotation] JSON part is empty');
        continue;
      }
      
      try {
        const jsonData = JSON.parse(cleanContent);
        console.log('[Annotation] Successfully parsed JSON from multipart');
        
        // If it's an array, wrap it in an object
        if (Array.isArray(jsonData)) {
          return { annotations: jsonData };
        }
        
        return jsonData as Record<string, unknown>;
      } catch (err) {
        console.error('[Annotation] Failed to parse JSON part:', err);
        console.error(`[Annotation] JSON content was: ${cleanContent.substring(0, 500)}`);
        continue;
      }
    }
  }
  
  console.log('[Annotation] No JSON part found in multipart message');
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file || file.size === 0) {
      return NextResponse.json(
        { error: 'No file uploaded.' },
        { status: 400 }
      );
    }

    // Create a new FormData object to send to the annotation service
    const annotationFormData = new FormData();
    annotationFormData.append('file', file);

    const annotationServiceUrl = `${process.env.NEXT_PUBLIC_SSE_BASE_URL}/annotation/annotate`;
    
    console.log(`[Annotation] Forwarding to: ${annotationServiceUrl}`);
    console.log(`[Annotation] File: ${file.name}, Size: ${file.size}, Type: ${file.type}`);

    // Forward the request to the annotation service
    let response;
    try {
      response = await fetch(annotationServiceUrl, {
        method: 'POST',
        body: annotationFormData
      });
    } catch (fetchError) {
      const errorMsg = fetchError instanceof Error ? fetchError.message : String(fetchError);
      console.error(`[Annotation] Connection failed: ${errorMsg}`);
      return NextResponse.json(
        { error: `Annotation service unavailable at ${annotationServiceUrl}. Make sure the service is running. Details: ${errorMsg}` },
        { status: 503 }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Annotation] Service error (${response.status}): ${errorText}`);
      return NextResponse.json(
        { error: `Annotation service error (${response.status}): ${errorText}` },
        { status: response.status }
      );
    }

    // Get the response as a blob
    const responseBlob = await response.blob();
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const arrayBuffer = await responseBlob.arrayBuffer();

    console.log(`[Annotation] Success! Received: ${contentType}, Size: ${arrayBuffer.byteLength} bytes`);

    // If response is multipart/mixed, extract both PDF and JSON
    if (contentType.includes('multipart/mixed') || contentType.includes('multipart')) {
      console.log('[Annotation] Detected multipart response, extracting PDF and JSON...');
      
      const pdfBuffer = extractPdfFromMultipart(arrayBuffer);
      const jsonData = extractJsonFromMultipart(arrayBuffer);
      
      if (pdfBuffer) {
        console.log(`[Annotation] Extracted PDF: ${pdfBuffer.byteLength} bytes`);
        
        // Convert PDF buffer to base64 for JSON response
        const pdfBase64 = Buffer.from(pdfBuffer).toString('base64');
        
        return NextResponse.json({
          success: true,
          pdf: pdfBase64,
          metadata: jsonData || {},
          message: 'Resume annotation completed'
        }, {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
    }

    // If we got here, we couldn't extract a PDF properly
    return NextResponse.json(
      { error: 'Could not extract annotated resume from service response' },
      { status: 500 }
    );
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[Annotation] Unexpected error: ${errorMsg}`);
    return NextResponse.json(
      { error: `Unexpected error: ${errorMsg}` },
      { status: 500 }
    );
  }
}
