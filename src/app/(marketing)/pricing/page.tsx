import type { Metadata } from "next";
import PricingPageClient from "@/components/layout/PricingPageClient";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent pricing for RentFAX rental risk and fraud intelligence.",
};

export default function PricingPage() {
  return <PricingPageClient />;
}
