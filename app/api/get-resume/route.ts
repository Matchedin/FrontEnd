import { promises as fs } from 'fs';
import path from 'path';
import mammoth from 'mammoth';

export async function GET() {
  try {
    // Look for any .docx file in the temp folder
    const tempDir = path.join(process.cwd(), 'temp');
    const files = await fs.readdir(tempDir);
    const docxFile = files.find(file => file.endsWith('.docx'));

    if (!docxFile) {
      return Response.json(
        { error: 'No .docx file found in temp folder' },
        { status: 404 }
      );
    }

    const filePath = path.join(tempDir, docxFile);
    
    // Extract text from the docx file
    const result = await mammoth.extractRawText({ path: filePath });
    const text = result.value;

    console.log('Extracted resume text from:', docxFile);
    console.log('Resume text:\n', text);

    return Response.json({ text });
  } catch (error) {
    console.error('Error reading resume:', error);
    return Response.json(
      { error: 'Failed to read resume file' },
      { status: 500 }
    );
  }
}
