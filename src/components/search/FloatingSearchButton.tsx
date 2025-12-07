"use client";

import { Search } from "lucide-react";

export default function FloatingSearchButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        fixed bottom-6 right-6 z-[999]
        h-14 w-14 rounded-full bg-[#1A2540] text-white shadow-xl
        flex items-center justify-center hover:bg-[#2E3C64]
        transition-all duration-200 active:scale-95
      "
    >
      <Search className="h-6 w-6" />
    </button>
  );
}
