import { NextRequest, NextResponse } from 'next/server';

// Role-based route protection for SAKTHI MESS
// Admin → /admin/* (only admin role)
// Kitchen Staff → /kitchen/* (kitchen_staff or admin role)
// Delivery Staff → /delivery/* (delivery_staff or admin role)
// Legacy /server/* → Redirects to /kitchen/dashboard

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle legacy server route redirects to kitchen dashboard
  if (pathname.startsWith('/server')) {
    const url = request.nextUrl.clone();
    url.pathname = '/kitchen/dashboard';
    return NextResponse.redirect(url);
  }

  // Read role from cookie (set by AuthContext)
  const role =
    request.cookies.get('sakthi_user_role')?.value ||
    request.cookies.get('bc_user_role')?.value;

  // ── Admin protection ──
  if (pathname.startsWith('/admin')) {
    if (role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  // ── Kitchen protection ──
  if (pathname.startsWith('/kitchen')) {
    if (role !== 'kitchen_staff' && role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  // ── Delivery protection ──
  if (pathname.startsWith('/delivery')) {
    if (role !== 'delivery_staff' && role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/kitchen/:path*', '/delivery/:path*', '/server/:path*'],
};
