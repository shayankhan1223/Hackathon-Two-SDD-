import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is protected (tasks routes)
  const isProtectedRoute = pathname.startsWith('/tasks');

  // Check for authentication token in cookies or local storage
  // Note: Since we're using localStorage in the client, we need to handle this differently
  // The actual authentication check happens on the client side
  // This middleware just ensures proper routing structure

  if (isProtectedRoute) {
    // The actual authentication check will happen in the page component
    // This middleware is just a placeholder for future enhancements
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
