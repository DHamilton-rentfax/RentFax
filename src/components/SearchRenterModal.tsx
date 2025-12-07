'use client';

import { useState } from 'react';

// Mock user for demonstration. In a real app, this would come from an auth context.
const mockUser = {
  companyId: 'company-123',
  plan: 'starter', // 'free', 'starter', 'pro', 'enterprise'
};

const mockResult = {
  verificationStatus: 'unverified',
  fullName: 'John Doe'
  // ... other properties
};

export function SearchRenterModal() {
  const [step, setStep] = useState(1);
  const [result, setResult] = useState<any>(mockResult);
  const [user, setUser] = useState<any>(mockUser);
  const [error, setError] = useState<string | null>(null);
  const [hasCredits, setHasCredits] = useState(true); // Assume true initially

  const handleIdentityCheckout = async () => {
    setError(null);

    // 1) Check credits first
    try {
      const creditRes = await fetch("/api/identity/check-credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: user?.companyId,
          plan: user?.plan,
        }),
      });

      const creditJson = await creditRes.json();

      if (!creditRes.ok || !creditJson.allowed) {
        setError(creditJson.message || "You have no identity credits remaining.");
        setHasCredits(false);
        return;
      }
    } catch (err) {
        setError("Failed to check credits. Please try again.");
        return;
    }

    // 2) Proceed to identity purchase flow
    try {
        const res = await fetch("/api/identity/purchase", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                companyId: user.companyId,
                renter: result, // or whatever renter data is needed
                searchSessionId: 'session-xyz', // a real session ID
            }),
        });

        const purchaseJson = await res.json();

        if (purchaseJson.url) {
            window.location.href = purchaseJson.url;
        } else {
            setError("Failed to start the purchase process.");
        }
    } catch (err) {
        setError("An error occurred during purchase. Please try again.");
    }
  };


  const renderStep2 = () => {
    return (
      <div>
        <h2>Step 2: Matched Profile (Preview)</h2>

        {!hasCredits && (
            <div className="my-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-sm text-red-700 font-semibold">
                    You have no identity credits remaining.
                </p>
                <p className="text-xs text-red-600 mt-1">
                    Purchase a credit pack from your company settings to continue.
                </p>
            </div>
        )}

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* ... other profile details ... */}
        
        <button onClick={handleIdentityCheckout} disabled={!hasCredits} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400">
            Proceed to Identity Check
        </button>
      </div>
    );
  };

  // ... other render functions for other steps

  return (
    <div className="modal p-8">
      <div className="modal-content">
        {/* For demo, we are locking this to step 2 to show the changes */}
        {renderStep2()}
      </div>
    </div>
  );
}
