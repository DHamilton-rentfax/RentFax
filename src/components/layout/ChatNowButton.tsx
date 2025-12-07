"use client";

import { MessageSquare } from "lucide-react";

export default function ChatNowButton() {
  const openChat = () => {
    // In a real app, this would open a chat widget (e.g., Intercom, Crisp, etc.)
    alert("Imagine a chat widget opening now!");
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
