import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    // Validate file exists
    if (!file || file.size === 0) {
      return NextResponse.json(
        { error: 'No file uploaded.' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.endsWith('.docx')) {
      return NextResponse.json(
        { error: 'Only .docx files are supported.' },
        { status: 400 }
      );
    }

    // Create FormData to send to backend
    const backendFormData = new FormData();
    backendFormData.append('file', file, file.name);

    const apiUrl = process.env.NEXT_PUBLIC_SSE_BASE_URL + '/Match/resume';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: backendFormData,
      headers: {
        // Don't set Content-Type manually - fetch will set it with boundary
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText || 'Failed to process resume' },
        { status: response.status }
      );
    }

    const body = await response.text();
    
    // Parse the JSON string from backend and return as JSON
    const jsonData = JSON.parse(body);
    return NextResponse.json(jsonData, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('Resume upload error:', errorMessage);
    return NextResponse.json(
      { error: `Error calling matching service: ${errorMessage}` },
      { status: 502 }
    );
  }
}
