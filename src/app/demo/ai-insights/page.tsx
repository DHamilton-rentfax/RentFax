import AiInsightsClient from './AiInsightsClient';

export const metadata = {
  title: "RentFAX Demo | AI Insights",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function AiInsightsPage() {
  return <AiInsightsClient />;
}
