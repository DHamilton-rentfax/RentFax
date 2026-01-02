"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function SelfVerifyPage() {
  const { token } = useParams();
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    fetch(`/api/self-verify/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((r) => r.ok ? setStatus("ok") : setStatus("error"))
      .catch(() => setStatus("error"));
  }, [token]);

  if (status === "loading") {
    return <div className="p-10 text-center">Verifying…</div>;
  }

  if (status === "error") {
    return <div className="p-10 text-center text-red-600">Invalid or expired link.</div>;
  }

  return (
    <div className="p-10 text-center">
      <h1 className="text-xl font-semibold">Verification Complete</h1>
      <p className="text-gray-600 mt-2">
        Your RentFAX profile has been verified.
      </p>
    </div>
  );
}
