"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/client";
import { Loader2 } from "lucide-react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // 1. Sign out from Firebase client authentication
        await signOut(auth);

        // 2. Call the server to revoke the session cookie
        const res = await fetch("/api/sessionLogout", {
          method: "POST",
        });

        if (!res.ok) {
          console.error("Server-side logout failed.");
        }

      } catch (error) {
        console.error("Error during logout:", error);
      } finally {
        // 3. Redirect to login page regardless of success/failure
        router.push("/login");
      }
    };

    handleLogout();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <Loader2 className="animate-spin h-12 w-12 mb-4" />
      <h1 className="text-2xl font-semibold">Signing Out</h1>
      <p className="text-gray-400">Please wait while we securely log you out...</p>
    </div>
  );
}
