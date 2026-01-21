"use client";

import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/client";
import { Loader2 } from "lucide-react";

export default function LogoutPage() {
  useEffect(() => {
    const handleLogout = async () => {
      try {
        /**
         * 1️⃣ Client-side Firebase logout
         */
        await signOut(auth);

        /**
         * 2️⃣ Server-side session cookie revocation
         * credentials: "include" ensures __session is sent
         */
        const res = await fetch("/api/sessionLogout", {
          method: "POST",
          credentials: "include",
        });

        if (!res.ok) {
          console.error("Server-side logout failed.");
        }
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        /**
         * 3️⃣ Hard redirect to login (subdomain-safe)
         */
        const loginUrl = process.env.NEXT_PUBLIC_APP_URL
          ? `${process.env.NEXT_PUBLIC_APP_URL}/login`
          : "/login";

        window.location.href = loginUrl;
      }
    };

    handleLogout();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <Loader2 className="animate-spin h-12 w-12 mb-4" />
      <h1 className="text-2xl font-semibold">Signing Out</h1>
      <p className="text-gray-400">
        Please wait while we securely log you out...
      </p>
    </div>
  );
}
