'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/client';
import GoogleButton from '@/components/auth/GoogleButton';
import '@/styles/auth.css';

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log('Form submitted');

    if (loading) return;

    setLoading(true);
    setError(null);
    console.log('Attempting to sign in with', email);

    try {
      // 1️⃣ Firebase client authentication
      const credential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      console.log('Firebase sign-in successful', credential.user);

      // 2️⃣ Force-refresh ID token
      const idToken = await credential.user.getIdToken(true);
      console.log('ID token refreshed');

      // 3️⃣ Exchange token for HTTP-only session cookie
      const res = await fetch('/api/auth/setSession', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      console.log('Session exchange response:', res.status);

      if (!res.ok) {
        throw new Error('Failed to establish session');
      }

      // 4️⃣ Navigate ONLY after cookie exists
      // Use full reload to avoid NEXT_REDIRECT dev bug with server-only /post-auth
      console.log('Redirecting to /api/post-auth');
      window.location.href = '/api/post-auth';
    } catch (err: any) {
      console.error('[Login Error]', err);

      if (
        err?.code === 'auth/user-not-found' ||
        err?.code === 'auth/wrong-password'
      ) {
        setError('Invalid email or password.');
      } else {
        setError('Unable to sign in. Please try again.');
      }

      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <GoogleButton />

      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-gray-300" />
        <span className="mx-4 text-sm text-gray-400">or</span>
        <div className="flex-grow border-t border-gray-300" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && <p className="text-sm text-red-600">{error}</p>}

        <input
          type="email"
          required
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="auth-input"
        />

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="auth-input"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.774 3.162 10.065 7.498a10.522 10.522 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243l-4.243-4.243"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5s-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="auth-button-primary"
        >
          {loading ? 'Signing in…' : 'Log in'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500">
        Don’t have an account?{' '}
        <a href="/signup" className="font-medium text-black hover:underline">
          Sign up
        </a>
      </p>
    </div>
  );
}
