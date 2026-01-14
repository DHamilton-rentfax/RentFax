import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/firebase/server';

/**
 * POST /api/renter/profile/change-password
 *
 * IMPORTANT:
 * - Password re-authentication + update MUST happen on the client using Firebase Client SDK
 * - This endpoint exists to:
 *   1. Verify session
 *   2. Revoke refresh tokens
 *   3. Log / acknowledge password change
 */
export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Verify session cookie
    const session =
      cookies().get('__session')?.value ||
      cookies().get('session')?.value ||
      cookies().get('firebaseSession')?.value;

    if (!session) {
      return NextResponse.json(
        { error: 'UNAUTHENTICATED' },
        { status: 401 }
      );
    }

    const decoded = await adminAuth.verifySessionCookie(session, true);
    const uid = decoded.uid;

    // 2️⃣ Parse request body (no passwords here)
    const body = await req.json().catch(() => ({}));
    const { clientConfirmed } = body;

    if (!clientConfirmed) {
      return NextResponse.json(
        { error: 'Client re-authentication not confirmed.' },
        { status: 400 }
      );
    }

    // 3️⃣ Revoke refresh tokens (force re-login everywhere)
    await adminAuth.revokeRefreshTokens(uid);

    // (Optional) log event here
    console.log(`[SECURITY] Password changed for user ${uid}`);

    return NextResponse.json({
      success: true,
      message: 'Password change acknowledged. Please log in again.',
    });
  } catch (error) {
    console.error('Password change error:', error);

    return NextResponse.json(
      { error: 'Unable to process password change.' },
      { status: 500 }
    );
  }
}
