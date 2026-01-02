'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import '@/styles/auth.css';
import { getAuth } from 'firebase/auth';

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  async function finish() {
    setLoading(true);
    const user = auth.currentUser;
    if (!user) {
        // This should not happen, but handle it just in case
        router.push('/login');
        return;
    }

    try {
        const token = await user.getIdToken();
        await fetch("/api/users/complete-onboarding", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        router.push("/dashboard");
    } catch (error) {
        console.error("Failed to complete onboarding:", error);
        // Optionally show an error message to the user
        setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-lg w-full space-y-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Welcome to RentFAX
        </h1>

        <p className="text-gray-600">
          Your account is almost ready. This step only happens once.
        </p>

        <div className="pt-4">
          <button 
            onClick={finish} 
            disabled={loading} 
            className="auth-button-primary max-w-xs mx-auto"
          >
            {loading ? 'Finalizing…' : 'Go to dashboard'}
          </button>
        </div>
      </div>
    </div>
  );
}
