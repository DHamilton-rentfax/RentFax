import DemoNotificationsClient from "./DemoNotificationsClient";

export const metadata = {
  title: "RentFAX Demo | Notifications",
  description: "Notifications for the RentFAX demo.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function NotificationsPage() {
  return <DemoNotificationsClient />;
}
