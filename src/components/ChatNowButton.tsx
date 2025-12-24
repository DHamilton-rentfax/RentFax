"use client";

import { MessageSquare } from "lucide-react";

export default function ChatNowButton() {
  const handleChatClick = () => {
    // In a real application, this would trigger a chat widget (e.g., Intercom, Crisp, etc.)
    alert("Imagine a chat widget opening now!");
  };

  return (
    <button
      onClick={handleChatClick}
      className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
    >
      <MessageSquare className="h-4 w-4" />
      Chat Now
    </button>
  );
}