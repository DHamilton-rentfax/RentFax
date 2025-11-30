
// src/hooks/use-auth.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
} from "react";
import { onAuthStateChanged, getIdTokenResult, User } from "firebase/auth";
import { auth } from "@/firebase/client";

export interface AppUser extends User {
  role?: string | null;
  companyId?: string | null;
  claims?: Record<string, any>;
}

interface AuthContextValue {
  user: AppUser | null;
  token: string | null;
  claims: Record<string, any> | null;
  role: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthContextValue>({
    user: null,
    token: null,
    claims: null,
    role: null,
    loading: true,
  });

  useEffect(() => {
    if (!auth) {
      console.error("Firebase auth is not initialized.");
      setState(s => ({ ...s, loading: false }));
      return;
    }
    
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setState({
          user: null,
          token: null,
          claims: null,
          role: null,
          loading: false,
        });
        return;
      }

      try {
        const tokenResult = await getIdTokenResult(firebaseUser, true); // Force refresh
        const claims = tokenResult.claims;
        const role = (claims.role as string) || null;

        const appUser: AppUser = {
          ...firebaseUser,
          role: role,
          companyId: claims.companyId || null,
          claims: claims
        };
        
        setState({
          user: appUser,
          token: tokenResult.token,
          claims: claims,
          role,
          loading: false,
        });
      } catch (err) {
        console.error("Error loading user token:", err);

        const appUser: AppUser = {
          ...firebaseUser,
          role: null,
          companyId: null,
          claims: {}
        };
        
        setState({
          user: appUser,
          token: null,
          claims: null,
          role: null,
          loading: false,
        });
      }
    });

    return () => unsub();
  }, []);

  const value = useMemo(() => state, [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
