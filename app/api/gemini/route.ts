import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const resume = formData.get('resume') as File | null;
    const profileString = formData.get('profile') as string | null;

    if (!profileString || !resume) {
      return NextResponse.json(
        { error: 'Profile and resume are required' },
        { status: 400 }
      );
    }

    const apiUrl = process.env.SSE_BASE_URL + '/gemini/coldEmail';

    const forwardFormData = new FormData();
    forwardFormData.append('resume', resume);
    forwardFormData.append('profile', profileString);

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: forwardFormData,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to generate cold email' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({ success: true, data });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
