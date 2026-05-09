import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value || request.cookies.get('auth_token')?.value;
  const rawRole = request.cookies.get('user_role')?.value || 'CUSTOMER';

  const role = rawRole.toLowerCase().replace('_', '-');
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname === '/login' || pathname === '/register';
  const isProtectedRoute = pathname.startsWith('/dashboard');

  const targetDashboard = role === 'customer' ? '/dashboard' : `/dashboard/${role}`;

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL(targetDashboard, request.url));
  }

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isProtectedRoute && token) {
    if (role === 'customer') {
      const staffDirectories = [
        '/dashboard/super-admin', '/dashboard/admin'
      ];

      const isSnooping = staffDirectories.some(dir => pathname.startsWith(dir));

      if (isSnooping) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } else {
      if (pathname === '/dashboard' || !pathname.startsWith(targetDashboard)) {
        return NextResponse.redirect(new URL(targetDashboard, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/dashboard/:path*',
  ],
};