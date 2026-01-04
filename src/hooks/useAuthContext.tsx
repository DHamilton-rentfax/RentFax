"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/firebase/client";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [impersonation, setImpersonation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return auth.onAuthStateChanged(async (u) => {
      setUser(u);
      setLoading(false);
      if (u) await refreshImpersonation();
    });
  }, []);

  async function refreshImpersonation() {
    const token = await auth.currentUser?.getIdToken();
    if (!token) return;

    const res = await fetch("/api/admin/impersonate/status", {
      headers: { authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setImpersonation(data.active ? data : null);
  }

  return (
    <AuthContext.Provider
      value={{ user, impersonation, refreshImpersonation, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
