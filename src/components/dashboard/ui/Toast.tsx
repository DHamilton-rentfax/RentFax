"use client";
import { useState } from "react";

export function Toast({ message, type }: { message: string; type?: "success" | "error" }) {
  const color = type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700";
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div
      onClick={() => setVisible(false)}
      className={`fixed bottom-4 right-4 px-4 py-2 rounded-md shadow-md ${color} cursor-pointer`}
    >
      {message}
    </div>
  );
}
