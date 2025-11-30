import DemoAnalyticsClient from "./DemoAnalyticsClient";

export const metadata = {
  title: "RentFAX Demo | Analytics",
  description: "Interactive analytics dashboard for the RentFAX demo.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function AnalyticsPage() {
  return <DemoAnalyticsClient />;
}
