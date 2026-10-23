import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME } from './lib/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME);
  const isAuthenticated = Boolean(sessionCookie?.value);

  // If hitting root '/'
  if (pathname === '/') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If trying to access login while already authenticated
  if (pathname === '/login') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Protected paths
  const protectedPaths = [
    '/dashboard',
    '/voice',
    '/live',
    '/agents',
    '/calls',
    '/settings',
    '/inbound',
    '/campaigns',
    '/analytics',
    '/integrations',
    '/team',
    '/audit',
  ];

  const isProtected = protectedPaths.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  );

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - logo.png, logo.jpg, public files
     * - api routes (handled independently)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/|logo|assets|.*\\..*).*)',
  ],
};
