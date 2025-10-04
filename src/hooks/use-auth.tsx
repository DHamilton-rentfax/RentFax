
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, getIdTokenResult } from "firebase/auth";
import { auth } from "@/firebase/client";

// Define roles in your system
export type UserRole = "super_admin" | "admin" | "editor" | "reviewer" | "user" | "rental_client" | "banned" | "content_manager" | null;

interface AuthContextType {
  user: User | null;
  claims: any | null;
  role: UserRole;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  claims: null,
  role: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [claims, setClaims] = useState<any | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const tokenResult = await getIdTokenResult(firebaseUser);
          const userClaims = tokenResult.claims;
          setClaims(userClaims);
          setRole((userClaims.role as UserRole) || "user");
        } catch (err) {
          console.error("Error fetching user claims:", err);
          setClaims(null);
          setRole("user"); // Default to basic role on error
        }
      } else {
        setClaims(null);
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, claims, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
