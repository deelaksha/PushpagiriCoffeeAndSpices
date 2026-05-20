import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /admin)
  const path = request.nextUrl.pathname;

  // If it's the admin path, check for a simple session cookie
  // Note: Firebase Auth tokens cannot be easily verified in Edge runtime.
  // In a full production app, you would verify a session cookie created via Firebase Admin SDK.
  // For this implementation, we will combine this middleware with a strong Client/Server component guard.
  if (path.startsWith('/admin')) {
    const sessionCookie = request.cookies.get('session');
    
    // If no session cookie exists, redirect to login
    if (!sessionCookie) {
      // Temporarily bypassed
      // return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Add paths to match
export const config = {
  matcher: ['/admin/:path*'],
};
