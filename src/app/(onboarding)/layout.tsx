"use client";

import { useOnboardingGuard } from "@/hooks/use-onboarding-guard";
import OnboardingHeader from "@/components/onboarding/OnboardingHeader";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  // Redirect logic + user load state
  const { loading } = useOnboardingGuard();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <OnboardingHeader />
      <main className="max-w-3xl mx-auto py-10 px-6">{children}</main>
    </div>
  );
}
