'use client';

import { createUserWithEmailAndPassword, User } from 'firebase/auth';
import { auth } from '@/firebase/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GoogleButton from './GoogleButton';
import '@/styles/auth.css';

export default function SignupForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [accountType, setAccountType] = useState<'business' | 'individual' | '' >('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  async function handleAccountCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const inviteCheck = await fetch('/api/beta/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: inviteCode }),
      });

      if (!inviteCheck.ok) {
        setError('Invalid or expired invite code.');
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setStep(2);
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please log in.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleFinish(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
        setError('An error occurred. Please try again.');
        return;
    }
    setLoading(true);
    try {
      await fetch('/api/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            uid: user.uid, 
            email, 
            accountType, 
            inviteCode 
        }),
      });
      router.push('/onboarding');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
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
      <form
        onSubmit={step === 1 ? handleAccountCreate : handleFinish}
        className="space-y-4"
      >
        {step === 1 && (
          <>
            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
            />

            <input
              type="password"
              required
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
            />

            <input
              type="text"
              required
              placeholder="Invite code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="auth-input"
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button type="submit" disabled={loading} className="auth-button-primary">
              {loading ? 'Checking…' : 'Continue'}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <button
              type="button"
              onClick={() => setAccountType('business')}
              className={`auth-button-secondary text-left ${
                accountType === 'business' ? 'border-black ring-2 ring-black' : ''
              }`}
            >
              <span className="font-bold">Business</span>
              <span className="text-xs block text-gray-500">I manage properties or rent to customers.</span>
            </button>

            <button
              type="button"
              onClick={() => setAccountType('individual')}
              className={`auth-button-secondary text-left ${
                accountType === 'individual' ? 'border-black ring-2 ring-black' : ''
              }`}
            >
              <span className="font-bold">Individual</span>
              <span className="text-xs block text-gray-500">I rent personally or on behalf of others.</span>
            </button>

            <button
              type="submit"
              disabled={!accountType || loading}
              className="auth-button-primary"
            >
              {loading ? 'Finalizing…' : 'Finish signup'}
            </button>
          </>
        )}
      </form>
      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <a href="/login" className="font-medium text-black hover:underline">
          Log in
        </a>
      </p>
    </div>
  );
}
