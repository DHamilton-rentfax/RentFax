"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/firebase/client";

export default function GoogleButton() {
  async function handleGoogle() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    window.location.href = "/onboarding";
  }

  return (
    <button
      type="button"
      onClick={handleGoogle}
      className="w-full rounded-lg border border-gray-300 py-3 text-sm font-medium hover:bg-gray-50 transition"
    >
      Continue with Google
    </button>
  );
}
