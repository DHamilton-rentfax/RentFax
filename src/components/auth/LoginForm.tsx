'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/client';
import { useRouter } from 'next/navigation';
import GoogleButton from './GoogleButton';
import '@/styles/auth.css';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch {
      setError('Invalid email or password.');
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <GoogleButton />
      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-sm text-gray-400">or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <form onSubmit={handleEmailSubmit} className="space-y-4">
        <input
          type="email"
          required
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
          disabled={loading}
        />

        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
          disabled={loading}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="auth-button-primary"
        >
          {loading ? 'Signing in…' : 'Log in with email'}
        </button>

        <p className="text-center text-sm text-gray-500">
          Don’t have an account?{' '}
          <a href="/signup" className="font-medium text-black hover:underline">
            Create one
          </a>
        </p>
      </form>
    </div>
  );
}
