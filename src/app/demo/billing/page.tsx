import DemoBillingClient from "./DemoBillingClient";

export const metadata = {
  title: "RentFAX Demo | Billing",
  description: "Billing and plan management for the RentFAX demo.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function BillingPage() {
  return <DemoBillingClient />;
}
