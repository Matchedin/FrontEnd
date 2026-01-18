import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const action = request.nextUrl.searchParams.get('action');

    if (action === 'clear') {
      // Clear temp folder
      const tempDir = path.join(process.cwd(), 'temp');
      try {
        const files = await fs.readdir(tempDir);
        for (const file of files) {
          await fs.unlink(path.join(tempDir, file));
        }
        console.log('Temp folder cleared');
        return NextResponse.json({ success: true, message: 'Temp folder cleared' });
      } catch (err) {
        console.error('Error clearing temp folder:', err);
        return NextResponse.json({ success: true }); // Ignore if folder doesn't exist
      }
    }

    if (action === 'save-json') {
      // Save JSON data to temp folder
      const { data, filename } = await request.json();
      const tempDir = path.join(process.cwd(), 'temp');
      
      // Create temp dir if it doesn't exist
      try {
        await fs.mkdir(tempDir, { recursive: true });
      } catch (err) {
        // Directory might already exist
      }

      const filePath = path.join(tempDir, filename || 'matches.json');
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      
      console.log('JSON saved to temp:', filename);
      return NextResponse.json({ success: true, filename });
    }

    if (action === 'save-file') {
      // Save uploaded file to temp folder
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      const filename = formData.get('filename') as string | null;

      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }

      const tempDir = path.join(process.cwd(), 'temp');
      
      // Create temp dir if it doesn't exist
      try {
        await fs.mkdir(tempDir, { recursive: true });
      } catch (err) {
        // Directory might already exist
      }

      const buffer = await file.arrayBuffer();
      const filePath = path.join(tempDir, filename || file.name);
      await fs.writeFile(filePath, Buffer.from(buffer));
      
      console.log('File saved to temp:', filename || file.name);
      return NextResponse.json({ success: true, filename: filename || file.name });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Temp management error:', errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
