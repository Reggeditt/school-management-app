import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Get auth token from cookies
  const authToken = request.cookies.get('auth-token')?.value;
  const userRole = request.cookies.get('user-role')?.value;

  // Protected routes configuration
  const protectedRoutes = {
    '/admin': ['admin'],
    '/teacher': ['teacher', 'admin'],
    '/student': ['student', 'admin'],
    '/parent': ['parent', 'admin']
  };

  // Check if the current path requires authentication
  const requiresAuth = Object.keys(protectedRoutes).some(route => 
    pathname.startsWith(route)
  );

  if (requiresAuth) {
    // Redirect to login if no auth token
    if (!authToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check role-based access
    const requiredRoles = Object.entries(protectedRoutes).find(([route]) => 
      pathname.startsWith(route)
    )?.[1];

    if (requiredRoles && userRole && !requiredRoles.includes(userRole)) {
      // Redirect to unauthorized page
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (authToken && (pathname === '/login' || pathname === '/register')) {
    const redirectPath = userRole === 'admin' ? '/admin/dashboard' :
                        userRole === 'teacher' ? '/teacher/dashboard' :
                        userRole === 'student' ? '/student/dashboard' :
                        userRole === 'parent' ? '/parent/dashboard' : '/';
    
    return NextResponse.redirect(new URL(redirectPath, request.url));
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
