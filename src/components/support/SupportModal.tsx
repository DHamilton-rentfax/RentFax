'use client';

import { useState } from 'react';
import { auth } from '@/firebase/client';

// Mock user for demo purposes.
// In production, this should come from auth / org context.
const mockUser = {
  companyId: 'company-123',
  plan: 'starter', // free | starter | pro | enterprise
};

const mockResult = {
  verificationStatus: 'unverified',
  fullName: 'John Doe',
  // other renter fields as needed
};

export function SearchRenterModal() {
  const [step, setStep] = useState(2); // locked to step 2 for demo
  const [result, setResult] = useState<any>(mockResult);
  const [user, setUser] = useState<any>(mockUser);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Starts renter identity verification checkout.
   * Uses centralized billing API with intent-based routing.
   */
  const handleIdentityCheckout = async () => {
    setError(null);
    setLoading(true);

    try {
      // 1️⃣ Get Firebase ID token
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error('User not authenticated');
      }

      // 2️⃣ Create Stripe Checkout session via billing API
      const res = await fetch('/api/billing/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          intent: 'VERIFY_RENTER',
          cart: {
            renter: result,
            companyId: user.companyId,
            searchSessionId: 'session-xyz',
            source: 'SearchRenterModal',
          },
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.url) {
        throw new Error(data?.error || 'Failed to start verification checkout');
      }

      // 3️⃣ Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      console.error('Identity checkout error:', err);
      setError('Unable to start identity verification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Step 2: Preview matched renter + trigger identity verification
   */
  const renderStep2 = () => {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          Matched Profile (Preview)
        </h2>

        <div className="p-4 border rounded-xl bg-white">
          <p className="font-medium">{result.fullName}</p>
          <p className="text-sm text-gray-600">
            Verification status: {result.verificationStatus}
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <button
          onClick={handleIdentityCheckout}
          disabled={loading}
          className="w-full px-4 py-2 rounded-lg bg-black text-white disabled:opacity-50"
        >
          {loading ? 'Redirecting…' : 'Proceed to Identity Verification'}
        </button>
      </div>
    );
  };

  return (
    <div className="modal p-8">
      <div className="modal-content max-w-md mx-auto">
        {step === 2 && renderStep2()}
      </div>
    </div>
  );
}
