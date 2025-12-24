"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CompanyInfoPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [companyType, setCompanyType] = useState("sole-proprietorship");

  const handleContinue = () => {
    // Here you would typically save the data to your backend
    console.log("Company Name:", companyName);
    console.log("Company Type:", companyType);
    router.push("/onboarding/step-2-owner-info");
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800">Tell us about your company</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
            Company Name
          </label>
          <input
            type="text"
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your Company LLC"
          />
        </div>

        <div>
          <label htmlFor="companyType" className="block text-sm font-medium text-gray-700">
            Type of Company
          </label>
          <select
            id="companyType"
            value={companyType}
            onChange={(e) => setCompanyType(e.target.value)}
            className="w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="sole-proprietorship">Sole Proprietorship</option>
            <option value="llc">LLC</option>
            <option value="corporation">Corporation</option>
            <option value="partnership">Partnership</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={!companyName}
        className="w-full py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Continue
      </button>
    </div>
  );
}
