"use client";
import { useState } from "react";
export default function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b py-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left font-medium"
      >
        {q}
      </button>
      {open && <p className="text-gray-600 mt-2 text-sm">{a}</p>}
    </div>
  );
}
