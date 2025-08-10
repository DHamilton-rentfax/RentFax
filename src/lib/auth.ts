'use client';
import { auth } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { whoAmI as whoAmIFlow } from '@/app/auth/actions';

export function watchAuth(cb: (u: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}

export async function fetchClaims() {
  await auth.currentUser?.getIdToken(true); // force refresh to pull latest claims
  const res = await whoAmIFlow();
  return res;
}
