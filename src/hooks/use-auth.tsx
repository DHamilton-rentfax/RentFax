
'use client';

import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { onIdTokenChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthInfo {
  user: User | null;
  loading: boolean;
  claims: any; // Consider defining a more specific type for claims
  token: string | null;
}

const AuthContext = createContext<AuthInfo>({ user: null, loading: true, claims: null, token: null });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authInfo, setAuthInfo] = useState<AuthInfo>({ user: null, loading: true, claims: null, token: null });

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const tokenResult = await user.getIdTokenResult();
        setAuthInfo({
          user,
          claims: tokenResult.claims,
          loading: false,
          token: tokenResult.token,
        });
      } else {
        setAuthInfo({ user: null, claims: null, loading: false, token: null });
      }
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthInfo {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
