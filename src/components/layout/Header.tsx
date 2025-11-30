 import ProfileMenu from "@/components/layout/ProfileMenu";
import NotificationBell from "@/components/notifications/NotificationBell";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <h1 className="font-semibold text-gray-800 dark:text-gray-100">
        RentFAX Dashboard
      </h1>

      <div className="flex items-center gap-4">
        <NotificationBell />
        <ProfileMenu />
      </div>
    </header>
  );
}
