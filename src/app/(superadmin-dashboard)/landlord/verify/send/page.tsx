"use client";
import { useState } from "react";

export default function SendLinkPage() {
  const [phone, setPhone] = useState("");

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Send Verification Link</h1>

      <input
        className="border p-3 w-full rounded-lg mb-4"
        placeholder="Renter Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full">
        Send Link
      </button>
    </div>
  );
}
