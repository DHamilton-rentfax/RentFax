
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
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/client";
import type { AppUser } from "@/types/user";

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
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
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
        // Fetch the user document from Firestore
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        // HARD GUARANTEE: If the user doc doesn't exist, block the app.
        if (!userDocSnap.exists()) {
          console.error("🔥 USER DOCUMENT MISSING — BLOCKING APP. UID:", firebaseUser.uid);
          // This is an intentional, loud failure as per the hardening plan.
          throw new Error("User profile not initialized in Firestore.");
        }
        
        const userDocData = userDocSnap.data();
        const tokenResult = await getIdTokenResult(firebaseUser, true); // Force refresh
        
        // Normalize Firestore data to prevent `undefined` from leaking into app state.
        const role =
          typeof userDocData.role === "string" ? userDocData.role : null;

        const companyId =
          typeof userDocData.companyId === "string" ? userDocData.companyId : null;

        const appUser: AppUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          companyId,
          role: role as AppUser['role'],
        };
        
        setState({
          user: appUser,
          token: tokenResult.token,
          claims: tokenResult.claims,
          role: appUser.role ?? null,
          loading: false,
        });

      } catch (err) {
        console.error("Error during auth state processing. Signing out.", err);

        // If the guard fails or any other error occurs, reset state and sign out
        // to prevent getting stuck in a broken state.
        auth.signOut();
        setState({
          user: null,
          token: null,
          claims: null,
          role: null,
          loading: false,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo(() => state, [state]);

  // The provider will now throw an error if the user document is missing,
  // which can be caught by an Error Boundary in React.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
