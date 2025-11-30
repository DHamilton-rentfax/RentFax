import DemoDashboardClient from "./DemoDashboardClient";

export const metadata = {
  title: "RentFAX Demo | Dashboard",
  description: "Interactive demo dashboard showing RentFAX’s AI-powered rental insights.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function DashboardPage() {
  return <DemoDashboardClient />;
}
