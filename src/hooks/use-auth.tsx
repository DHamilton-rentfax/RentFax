
'use client';

import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/firebase/client';
import { doc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  user: (User & { role?: string }) | null;
  loading: boolean;
  role: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  role: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authInfo, setAuthInfo] = useState<AuthContextType>({
    user: null,
    loading: true,
    role: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setAuthInfo({
            user: { ...user, role: userData.role },
            loading: false,
            role: userData.role,
          });
        } else {
          setAuthInfo({ user, loading: false, role: null });
        }
      } else {
        setAuthInfo({ user: null, loading: false, role: null });
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
