import { ChatEntryPoint } from '@/components/chat/ChatEntryPoint';

export default function LandlordLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
      <ChatEntryPoint />
    </div>
  );
}
