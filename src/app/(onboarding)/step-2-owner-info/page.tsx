"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OwnerInfoPage() {
  const router = useRouter();
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");

  const handleContinue = () => {
    // Here you would typically save the data to your backend
    console.log("Owner Name:", ownerName);
    console.log("Owner Email:", ownerEmail);
    router.push("/onboarding/step-3-risk-preferences");
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800">Tell us about the owner</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="ownerName"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            className="w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="ownerEmail" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            id="ownerEmail"
            value={ownerEmail}
            onChange={(e) => setOwnerEmail(e.target.value)}
            className="w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="john.doe@example.com"
          />
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={!ownerName || !ownerEmail}
        className="w-full py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Continue
      </button>
    </div>
  );
}
