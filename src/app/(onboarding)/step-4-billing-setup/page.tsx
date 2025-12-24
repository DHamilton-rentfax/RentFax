"use client";

import { useRouter } from "next/navigation";

export default function BillingSetupPage() {
  const router = useRouter();

  const handleSelectPlan = (plan: 'starter' | 'pro') => {
    // Here you would typically initiate the Stripe checkout session
    console.log("Selected Plan:", plan);
    // For this example, we'll just navigate to the completion page
    router.push("/onboarding/complete");
  };

  return (
    <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800">Choose your plan</h2>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Starter Plan */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800">Starter</h3>
          <p className="mt-2 text-gray-600">For individuals and small teams.</p>
          <p className="mt-4 text-3xl font-bold text-gray-900">$29 <span className="text-base font-normal">/ month</span></p>
          <button
            onClick={() => handleSelectPlan('starter')}
            className="w-full py-2 mt-6 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Choose Starter
          </button>
        </div>

        {/* Pro Plan */}
        <div className="p-6 border-2 border-blue-600 rounded-lg relative">
          <div className="absolute top-0 right-0 px-2 py-1 text-xs font-semibold text-white bg-blue-600 rounded-bl-md">MOST POPULAR</div>
          <h3 className="text-xl font-semibold text-gray-800">Pro</h3>
          <p className="mt-2 text-gray-600">For growing businesses and enterprises.</p>
          <p className="mt-4 text-3xl font-bold text-gray-900">$99 <span className="text-base font-normal">/ month</span></p>
          <button
            onClick={() => handleSelectPlan('pro')}
            className="w-full py-2 mt-6 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Choose Pro
          </button>
        </div>
      </div>
    </div>
  );
}
