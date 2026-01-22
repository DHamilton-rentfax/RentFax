"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

export default function ConfirmPage() {
  // 🔒 Hooks MUST be declared unconditionally
  const params = useParams<{ token?: string }>();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = params?.token;

  async function submit(decision: "confirm" | "deny") {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/verify/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, decision }),
      });

      if (!res.ok) {
        const j = await res.json();
        setError(j.error || "Something went wrong");
        return;
      }

      setDone(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // 🔒 All conditional rendering happens AFTER hooks
  if (!token) {
    return (
      <div className="max-w-xl mx-auto mt-20 text-center">
        <p className="text-gray-600">
          Invalid or missing confirmation token.
        </p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="max-w-xl mx-auto mt-20 text-center">
        <h1 className="text-2xl font-semibold mb-4">
          Response Recorded
        </h1>
        <p className="text-gray-600">
          Thank you. If this was a mistake, you may update your response within
          24 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-20 bg-white p-8 rounded-2xl shadow">
      <h1 className="text-2xl font-semibold mb-4">
        Confirm Rental Activity
      </h1>

      <p className="text-gray-600 mb-6">
        A company reported a rental involving your information.
        Please confirm whether this looks correct.
      </p>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex gap-4">
        <button
          disabled={loading}
          onClick={() => submit("confirm")}
          className="flex-1 bg-black text-white py-3 rounded-xl disabled:opacity-60"
        >
          Yes, this was me
        </button>

        <button
          disabled={loading}
          onClick={() => submit("deny")}
          className="flex-1 border border-gray-300 py-3 rounded-xl disabled:opacity-60"
        >
          I don’t recognize this
        </button>
      </div>
    </div>
  );
}
