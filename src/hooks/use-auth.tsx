
'use client';

import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/firebase/client';
import { whoAmI } from '@/app/auth/actions';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  claims: any | null;
  role: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  claims: null,
  role: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authInfo, setAuthInfo] = useState<AuthContextType>({
    user: null,
    loading: true,
    claims: null,
    role: null
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult(true);
        setAuthInfo({ 
          user, 
          loading: false, 
          claims: idTokenResult.claims,
          role: idTokenResult.claims.role as string || null
        });
      } else {
        setAuthInfo({ user: null, loading: false, claims: null, role: null });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
