import DemoSearchClient from "./DemoSearchClient";

export const metadata = {
  title: "RentFAX Demo | Search",
  description: "Search for renters in the RentFAX demo.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function SearchPage() {
  return <DemoSearchClient />;
}
