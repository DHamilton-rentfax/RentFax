import '@/lib/server-only';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/firebase/server';

export async function POST() {
  const session = cookies().get('__session')?.value;

  if (session) {
    try {
      const decoded = await adminAuth.verifySessionCookie(session, true);
      await adminAuth.revokeRefreshTokens(decoded.uid);
    } catch {
      // session already invalid
    }
  }

  cookies().delete('__session');

  return NextResponse.json({ success: true });
}
