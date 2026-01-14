'use client';

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/firebase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function GoogleButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleGoogleLogin() {
    if (loading) return;
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);

      const idToken = await cred.user.getIdToken(true);

      const res = await fetch('/api/auth/setSession', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        throw new Error('Failed to create session');
      }

      router.replace('/post-auth');
    } catch (err) {
      console.error('[Google Login Error]', err);
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={loading}
      className="auth-button-secondary w-full"
    >
      {loading ? 'Signing in…' : 'Continue with Google'}
    </button>
  );
}