"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";

import OnboardingProgress from "@/components/OnboardingProgress";

export default function OnboardingCallPage() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center"
      >
        <OnboardingProgress step={3} totalSteps={4} />

        <div className="flex flex-col items-center mb-6">
          <CalendarDays size={64} className="text-blue-400 mb-3" />
          <h1 className="text-3xl font-bold mb-2">Book Your Onboarding Call</h1>
          <p className="text-gray-300 mb-6">
            Schedule a 15-minute onboarding session with our RentFAX team.  
            We'll walk you through your dashboard, compliance setup, and reporting tools.
          </p>
        </div>

        <iframe
          src="https://calendly.com/rentfax-onboarding/15min"
          width="100%"
          height="500"
          className="rounded-xl border border-white/20"
        ></iframe>

        <button
          onClick={() => router.push("/onboarding/success")}
          className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90"
        >
          Skip for Now
        </button>
      </motion.div>
    </main>
  );
}