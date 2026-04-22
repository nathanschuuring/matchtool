import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'matchtool_auth';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Alleen /admin routes checken
  if (!pathname.startsWith('/admin')) return NextResponse.next();

  // Login-pagina altijd toegankelijk
  if (pathname === '/admin/login') return NextResponse.next();

  const cookie = req.cookies.get(COOKIE_NAME);
  if (!cookie) {
    const url = req.nextUrl.clone();
    url.pathname = '/admin/login';
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
