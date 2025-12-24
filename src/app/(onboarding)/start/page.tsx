"use client";

import { useRouter } from "next/navigation";

export default function OnboardingStart() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome to RentFAX Onboarding</h1>
      <p className="text-gray-600">
        Let’s get your company set up. This will take about 2–3 minutes.
      </p>

      <ul className="list-disc ml-6 text-gray-600 space-y-1">
        <li>Company Information</li>
        <li>Owner Identity Verification</li>
        <li>Risk & Notification Preferences</li>
        <li>Billing Setup</li>
        <li>Final Review</li>
      </ul>

      <button
        onClick={() => router.push("/onboarding/company-info")}
        className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800"
      >
        Start Setup
      </button>
    </div>
  );
}
