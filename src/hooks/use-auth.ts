'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { fetchClaims } from '@/lib/auth';

interface AuthInfo {
  user: User | null;
  loading: boolean;
  claims: any;
}

export function useAuth(): AuthInfo {
  const [authInfo, setAuthInfo] = useState<AuthInfo>({
    user: null,
    loading: true,
    claims: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const claims = await fetchClaims();
        setAuthInfo({ user, claims, loading: false });
      } else {
        setAuthInfo({ user: null, claims: null, loading: false });
      }
    });

    return () => unsubscribe();
  }, []);

  return authInfo;
}
