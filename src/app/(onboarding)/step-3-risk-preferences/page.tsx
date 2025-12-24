"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RiskPreferencesPage() {
  const router = useRouter();
  const [riskAppetite, setRiskAppetite] = useState("moderate");
  const [notificationThreshold, setNotificationThreshold] = useState(50);

  const handleContinue = () => {
    // Here you would typically save the data to your backend
    console.log("Risk Appetite:", riskAppetite);
    console.log("Notification Threshold:", notificationThreshold);
    router.push("/onboarding/step-4-billing-setup");
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800">Set your risk preferences</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="riskAppetite" className="block text-sm font-medium text-gray-700">
            Risk Appetite
          </label>
          <select
            id="riskAppetite"
            value={riskAppetite}
            onChange={(e) => setRiskAppetite(e.target.value)}
            className="w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label htmlFor="notificationThreshold" className="block text-sm font-medium text-gray-700">
            Notification Threshold: {notificationThreshold}%
          </label>
          <input
            type="range"
            id="notificationThreshold"
            min="0"
            max="100"
            value={notificationThreshold}
            onChange={(e) => setNotificationThreshold(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      <button
        onClick={handleContinue}
        className="w-full py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Continue
      </button>
    </div>
  );
}
