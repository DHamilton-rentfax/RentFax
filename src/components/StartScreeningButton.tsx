"use client";

import { useModal } from "@/contexts/ModalContext";
import { Search } from "lucide-react";

export default function StartScreeningButton({ className = "" }) {
  const { openModal } = useModal();

  return (
    <button
      onClick={() => openModal("searchRenter")}
      className={`flex items-center justify-center rounded-full font-semibold transition px-4 py-2 bg-[#0f172a] text-white hover:bg-black ${className}`}
    >
      <Search className="h-5 w-5 mr-2" />
      Start Screening
    </button>
  );
}
