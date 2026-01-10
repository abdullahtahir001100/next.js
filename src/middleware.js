import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('admin_token')?.value;

  const isAdminRoute = path.startsWith('/admin');
  const isLoginPage = path === '/admin/login';

  // Case 1: Admin route par ja raha hai aur login NAHI hai -> Redirect to Login
  if (isAdminRoute && !isLoginPage && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Case 2: Pehle se LOGIN hai aur login page par jane ki koshish kare -> Redirect to Dashboard
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/admin/shopProductsAdmin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};