import { NextRequest, NextResponse } from 'next/server';
import type { Profile } from '../../../types/profile';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q') || '';
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || ''}/api/database/searchByName?query=${encodeURIComponent(query)}`);
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: res.status });
    }
    const profiles: Profile[] = await res.json();
    return NextResponse.json(profiles);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
