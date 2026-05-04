import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const COOKIE_NAME = 'activework_auth';

function getToken(): string {
  // Gebruik het admin-wachtwoord als "token" — simpel maar voldoende voor deze tool
  return Buffer.from(process.env.ADMIN_PASSWORD || 'geen-wachtwoord-ingesteld').toString('base64');
}

export function isAuthenticated(): boolean {
  const cookieStore = cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie) return false;
  return cookie.value === getToken();
}

export function setAuthCookie(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, getToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 dagen
    path: '/',
  });
  return response;
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.delete(COOKIE_NAME);
  return response;
}

export function verifyPassword(password: string): boolean {
  return password === process.env.ADMIN_PASSWORD;
}