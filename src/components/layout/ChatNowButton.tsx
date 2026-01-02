'use client';

import { useModal } from '@/contexts/ModalContext';
import AIChatModal from '@/components/chat/AIChatModal';
import { MessageSquare } from 'lucide-react';

export default function ChatNowButton() {
  const modal = useModal();

  const openChat = () => {
    modal.open(AIChatModal);
  };

  return (
    <button
      onClick={openChat}
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
    >
      <MessageSquare size={18} />
      Chat Now
    </button>
  );
}
