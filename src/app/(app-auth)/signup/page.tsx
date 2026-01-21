'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import SignupForm from '@/components/auth/SignupForm';

export default function SignupPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // ⛔ wait for Firebase auth to settle
    if (loading) return;

    // ✅ already authenticated users go through the unified decision point
    if (user) {
      router.replace('/post-auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="text-sm text-gray-500 text-center">
        Loading…
      </div>
    );
  }

  return <SignupForm />;
}
