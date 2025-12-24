'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function VerifyPage() {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<"loading" | "ready" | "done" | "error">(
    "loading"
  );
  const [error, setError] = useState<string | null>(null);

  async function submit(decision: "CONFIRMED" | "DENIED") {
    try {
      const res = await fetch("/api/self-verify/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, decision }),
      });

      if (!res.ok) throw new Error("Failed");

      setStatus("done");
    } catch {
      setError("Verification failed.");
    }
  }

  useEffect(() => {
    if (token) setStatus("ready");
  }, [token]);

  if (status === "loading") return <p className="p-6">Loading…</p>;

  if (status === "done") {
    return (
      <div className="p-6 text-center space-y-3">
        <h1 className="text-lg font-semibold">Thank you</h1>
        <p className="text-sm text-gray-600">
          Your response has been recorded.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto space-y-6">
      <h1 className="text-xl font-semibold text-center">
        Confirm Rental Activity
      </h1>

      <p className="text-sm text-gray-600 text-center">
        Please confirm whether you rented from the requesting party.
      </p>

      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}

      <button
        onClick={() => submit("CONFIRMED")}
        className="w-full rounded-full bg-green-600 text-white py-2 font-semibold"
      >
        Yes, I rented
      </button>

      <button
        onClick={() => submit("DENIED")}
        className="w-full rounded-full bg-red-600 text-white py-2 font-semibold"
      >
        No, this was not me
      </button>
    </div>
  );
}
