'use client';
import {auth as clientAuth} from './firebase';
import {onAuthStateChanged, User, getIdToken} from 'firebase/auth';
import {whoAmI as whoAmIFlow} from '@/app/auth/actions';

export function watchAuth(cb: (u: User | null) => void) {
  return onAuthStateChanged(clientAuth, cb);
}

export async function fetchClaims() {
  if (clientAuth.currentUser) {
    await getIdToken(clientAuth.currentUser, true); // force refresh to pull latest claims
  }
  const res = await whoAmIFlow();
  return res;
}
