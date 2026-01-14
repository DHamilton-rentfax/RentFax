'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';

export default function OnboardingGate({
  role,
  children,
}: {
  role: 'RENTER' | 'ADMIN' | 'SUPPORT';
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!user) return;

    fetch(`/api/onboarding/status?role=${role}`)
      .then((r) => r.json())
      .then((d) => setShow(!d.completed));
  }, [user, role]);

  if (show) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl w-[420px]">
          <h2 className="text-lg font-semibold">Welcome to RentFAX</h2>
          <p className="text-sm text-gray-600 mt-2">
            Let’s walk through how this dashboard works.
          </p>

          <button
            onClick={async () => {
              await fetch('/api/onboarding/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role }),
              });
              setShow(false);
            }}
            className="mt-4 auth-button-primary"
          >
            Start Tour
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
