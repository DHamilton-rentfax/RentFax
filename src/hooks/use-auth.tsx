'use client';

import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { fetchClaims } from '@/lib/auth';

interface AuthInfo {
  user: User | null;
  loading: boolean;
  claims: any;
}

const AuthContext = createContext<AuthInfo>({ user: null, loading: true, claims: null });

export function AuthProvider({ children }: { children: ReactNode }) {
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

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthInfo {
  return useContext(AuthContext);
}
