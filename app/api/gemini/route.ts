import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const profileJson = body.profileJson as string | null;
    const resumeText = body.resumeText as string | null;

    if (!profileJson || !resumeText) {
      return NextResponse.json(
        { error: 'ProfileJson and resumeText are required' },
        { status: 400 }
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_SSE_BASE_URL + '/gemini/coldEmail';
    console.log('Calling API:', apiUrl);
    console.log('Profile:', profileJson);
    console.log('Resume text length:', resumeText.length, 'characters');

    const payload = {
      profileJson,
      resumeText
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to generate introductory email' },
        { status: response.status }
      );
    }

    const emailText = await response.text();
    return new NextResponse(emailText, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Gemini API error:', errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
