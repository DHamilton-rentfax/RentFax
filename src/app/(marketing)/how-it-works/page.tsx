import type { Metadata } from "next";
import HowItWorksPageClient from "@/components/layout/HowItWorksPageClient";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Learn how RentFAX uses AI to verify renters, detect fraud, and provide actionable risk intelligence for your rental business.",
};

export default function HowItWorksPage() {
  return <HowItWorksPageClient />;
}
