"use client";

import { useState } from "react";

export default function MemberIdRequestForm({
  onSubmit,
  loading,
}: {
  onSubmit: (memberId: string) => Promise<void>;
  loading: boolean;
}) {
  const [memberId, setMemberId] = useState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId) return;
    onSubmit(memberId);
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="p-4 border rounded-lg bg-white shadow-sm"
    >
      <h3 className="text-lg font-semibold mb-2">
        Verify Renter Before Handover
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Enter the renter's Member ID to send a confirmation request. This ensures
        the person you're giving keys to is the verified individual.
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value.toUpperCase())}
          placeholder="RFX-..."
          className="flex-grow p-2 border rounded-md"
          pattern="^RFX-[A-Z0-9]{3,}-[A-Z0-9]{3,}$"
          title="Please enter a valid RentFAX Member ID (e.g., RFX-NYC-7K4M9Q)"
        />
        <button
          type="submit"
          disabled={loading || !memberId}
          className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:bg-gray-400"
        >
          {loading ? "Sending..." : "Request Confirmation"}
        </button>
      </div>
    </form>
  );
}