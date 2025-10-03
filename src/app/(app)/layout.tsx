
import Protected from "@/components/protected";
import { NotificationBell } from "@/components/admin/NotificationBell";
import ChatWidget from "@/components/chat/ChatWidget";
import { Toaster } from 'sonner';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Protected roles={['super_admin', 'admin', 'editor', 'reviewer', 'user', 'content_manager', 'rental_client']}>
        <Toaster richColors />
        <div className="flex justify-end p-4">
            <NotificationBell />
        </div>
        {children}
        <ChatWidget />
    </Protected>
  );
}
