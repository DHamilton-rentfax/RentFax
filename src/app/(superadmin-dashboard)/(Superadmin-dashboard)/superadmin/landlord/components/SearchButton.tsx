"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

const SearchRenterModal = dynamic(
  () => import("../search/SearchRenterModal"),
  {
    ssr: false,
    loading: () => null,
  }
);
export default function SearchButton({ onComplete }: { onComplete: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        className="bg-[#1A2540] hover:bg-[#27304f] text-white flex items-center gap-2"
        onClick={() => setOpen(true)}
      >
        <Search size={18} />
        Search Renter
      </Button>

      <SearchRenterModal
        open={open}
        onClose={() => setOpen(false)}
        onResult={() => onComplete()}
      />
    </>
  );
}
