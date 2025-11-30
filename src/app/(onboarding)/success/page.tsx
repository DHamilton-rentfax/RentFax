"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import OnboardingProgress from "@/components/OnboardingProgress";

export default function OnboardingSuccessPage() {
  const router = useRouter();
  const [userType, setUserType] = useState("individual");

  useEffect(() => {
    const type = localStorage.getItem("signupType");
    if (type) {
      setUserType(type);
    }
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 text-white text-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 max-w-md text-center"
      >
        <OnboardingProgress step={userType === 'company' ? 4 : 3} totalSteps={userType === 'company' ? 4 : 3} />
        <h1 className="text-4xl font-bold mb-4">Welcome to RentFAX 🎉</h1>
        <p className="text-lg mb-6 text-blue-100">
          Your account setup is complete. You’re now ready to explore your dashboard.
        </p>
        <button
          onClick={() => {
            if (userType === "company") router.push("/(client-company-dashboard)/dashboard");
            else router.push("/(applicant-portal)/dashboard");
          }}
          className="bg-white text-blue-700 font-medium px-6 py-3 rounded-xl hover:bg-blue-50"
        >
          Go to Dashboard
        </button>
      </motion.div>
    </main>
  );
}
