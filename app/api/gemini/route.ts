import { NextRequest, NextResponse } from 'next/server';

export async function POST(profile: string, resume: File) {
  try {
    if (!profile || !resume) {
      return NextResponse.json(
        { error: 'Profile and resume are required' },
        { status: 400 }
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_SSE_BASE_URL + '/gemini/coldEmail';

    const forwardFormData = new FormData();
    forwardFormData.append('resume', resume);
    forwardFormData.append('profile', profile);

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
    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
