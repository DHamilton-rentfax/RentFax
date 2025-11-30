'use client';

import { useEffect, useState } from "react";

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/landlord/subscription");
      const data = await res.json();
      setSubscription(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Subscription</h1>

      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-lg">
        <p className="font-bold">Upgrade Required</p>
        <p>Your current plan does not have access to this feature. Please upgrade to a premium plan to continue.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border rounded-xl shadow p-8">
          <h2 className="text-2xl font-bold mb-4">Free Plan</h2>
          <p className="text-gray-600 mb-6">Basic access for landlords.</p>
          <ul className="space-y-2 text-gray-700">
            <li>✓ Renter Search</li>
            <li>✓ Basic Renter Profiles</li>
            <li>✗ Full RentFAX Reports</li>
            <li>✗ AI Risk Summaries</li>
            <li>✗ Fraud & Eviction Checks</li>
          </ul>
          <button className="w-full mt-6 bg-gray-200 text-gray-800 py-2 rounded-lg" disabled>
            Current Plan
          </button>
        </div>

        <div className="bg-white border-2 border-blue-600 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Premium Plan</h2>
          <p className="text-gray-600 mb-6">Unlock the full power of RentAGI.</p>
          <ul className="space-y-2 text-gray-700">
            <li>✓ Renter Search</li>
            <li>✓ Full RentFAX Reports</li>
            <li>✓ AI Risk Summaries</li>
            <li>✓ Fraud & Eviction Checks</li>
            <li>✓ Priority Support</li>
          </ul>
          <button className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            Upgrade for $29/mo
          </button>
        </div>
      </div>
    </div>
  );
}
