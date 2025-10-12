import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps } from 'firebase-admin/app';
import { NextRequest } from 'next/server';

if (!getApps().length) {
  initializeApp();
}

const auth = getAuth();

export const authUser = async (req: Request) => {
  try {
    const header = req.headers.get('Authorization');
    if (!header) {
      return null;
    }
    const token = header.replace('Bearer ', '');
    const decodedToken = await auth.verifyIdToken(token);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role,
    };
  } catch (error) {
    console.error('Auth user error:', error);
    return null;
  }
};
