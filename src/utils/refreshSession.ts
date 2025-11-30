import { auth } from "@/firebase/client";
import { getIdToken } from "firebase/auth";

/**
 * Refresh the Firebase session cookie.
 * Called automatically by `use-auth.tsx` whenever the ID token changes.
 */
export const refreshSessionCookie = async () => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const idToken = await getIdToken(user, true);
    const res = await fetch("/api/sessionLogin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    if (!res.ok) {
      console.error("Failed to refresh session cookie:", await res.text());
      throw new Error("Session refresh failed");
    }

    return await res.json();
  } catch (error) {
    console.error("Error in refreshSessionCookie:", error);
  }
};
