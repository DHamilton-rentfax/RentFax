import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';

export async function middleware(req) {
  const session = await verifySession(req);

  if (!session?.verified && req.nextUrl.pathname.startsWith("/renter/secure")) {
    return NextResponse.redirect("/renter/verify");
  }

  return NextResponse.next();
}
