"use client";

import { CheckCircle } from "lucide-react";

interface ChecklistItemProps {
  done: boolean;
  children: React.ReactNode;
}

export default function ChecklistItem({ done, children }: ChecklistItemProps) {
  return (
    <div className="flex items-center space-x-3">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
          done ? "bg-emerald-500" : "bg-gray-200"
        }`}
      >
        {done && <CheckCircle className="w-4 h-4 text-white" />}
      </div>
      <span className={`${done ? "text-gray-400 line-through" : "font-medium"}`}>
        {children}
      </span>
    </div>
  );
}
