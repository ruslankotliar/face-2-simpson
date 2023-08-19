import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  // do not localize next.js paths
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)'],
};
