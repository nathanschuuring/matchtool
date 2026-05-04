import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getAllSettings, setSetting } from '@/lib/settings';

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 });
  }

  const settings = await getAllSettings();
  return NextResponse.json(settings);
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Update alle keys uit de body
    for (const [key, value] of Object.entries(body)) {
      await setSetting(key, String(value || ''));
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
