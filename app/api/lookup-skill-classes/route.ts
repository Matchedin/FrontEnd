import { NextRequest, NextResponse } from 'next/server';

interface SkillClassInput {
  university: string;
  skills: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as SkillClassInput;
    const { university, skills } = body;

    if (!university || !skills || skills.length === 0) {
      return NextResponse.json(
        { error: 'University and skills array are required' },
        { status: 400 }
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_SSE_BASE_URL + '/Gemini/lookupSkillClasses';
    console.log('Calling API:', apiUrl);
    console.log('University:', university);
    console.log('Skills:', skills);

    const payload = {
      university,
      skills
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
        { error: 'Failed to lookup skill classes' },
        { status: response.status }
      );
    }

    let classesJson = await response.text();
    
    // Strip markdown formatting if present (```json ... ```)
    if (classesJson.startsWith('```json')) {
      classesJson = classesJson.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    }
    
    return new NextResponse(classesJson, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Lookup classes error:', errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
