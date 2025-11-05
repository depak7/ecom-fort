import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const isApiRequest = req.nextUrl.pathname.startsWith("/api");

    if (isApiRequest) {
      return new NextResponse(
        JSON.stringify({ status: false, message: "Unauthorized access" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    const signInUrl=(new URL('/signin', req.url));
    signInUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/stores/:path*', '/api/products/:path*' , '/api/admin/:path*', '/api/sendemail/:path*'],
};