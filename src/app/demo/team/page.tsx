import DemoTeamClient from "./DemoTeamClient";

export const metadata = {
  title: "RentFAX Demo | Team Management",
  description: "Team management for the RentFAX demo.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function TeamPage() {
  return <DemoTeamClient />;
}
