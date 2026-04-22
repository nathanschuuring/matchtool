import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, setAuthCookie, clearAuthCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { action, password } = await req.json();

  if (action === 'logout') {
    const response = NextResponse.json({ success: true });
    return clearAuthCookie(response);
  }

  if (action === 'login') {
    if (!password) {
      return NextResponse.json({ error: 'Wachtwoord vereist' }, { status: 400 });
    }
    if (!verifyPassword(password)) {
      return NextResponse.json({ error: 'Ongeldig wachtwoord' }, { status: 401 });
    }
    const response = NextResponse.json({ success: true });
    return setAuthCookie(response);
  }

  return NextResponse.json({ error: 'Onbekende actie' }, { status: 400 });
}
