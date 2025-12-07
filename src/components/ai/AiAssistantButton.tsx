"use client";

import { Bot } from "lucide-react";

export default function AiAssistantButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-6 h-14 w-14 rounded-full bg-[#D4AF37] text-[#1A2540]
        shadow-xl flex items-center justify-center hover:bg-[#c99c2e]
        transition-all duration-200 active:scale-95 z-[999]"
    >
      <Bot className="h-6 w-6" />
    </button>
  );
}
