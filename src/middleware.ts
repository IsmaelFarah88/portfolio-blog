import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Check if the user is authenticated
  const isAuthenticated = request.cookies.get('isAuthenticated')?.value === 'true';
  
  // If the user is trying to access the admin panel and is not authenticated, redirect to login
  if (request.nextUrl.pathname.startsWith('/admin') && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If the user is authenticated and trying to access login page, redirect to admin
  if (request.nextUrl.pathname === '/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }
  
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*', '/login'],
};