/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Status =
  | "loading"
  | "invalid"
  | "approved"
  | "denied"
  | "error";

export default function VerifyMemberPage() {
  const params = useSearchParams();
  const requestId = params.get("id");
  const token = params.get("token");

  const [status, setStatus] = useState<Status>("loading");
  const [orgName, setOrgName] = useState<string | null>(null);

  useEffect(() => {
    if (!requestId || !token) {
      setStatus("invalid");
      return;
    }

    fetch(`/api/member-id/verify?id=${requestId}&token=${token}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Verification check failed");
        }
        return res.json();
      })
      .then((data) => {
        if (!data.valid) {
          setStatus("invalid");
        } else {
          setOrgName(data.orgName);
          setStatus("loading"); // Keep loading until user acts
        }
      })
      .catch(() => setStatus("invalid"));
  }, [requestId, token]);

  async function respond(action: "approve" | "deny") {
    setStatus("loading");

    const res = await fetch("/api/member-id/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, token, action }),
    });

    if (!res.ok) {
      setStatus("error");
      return;
    }

    setStatus(action === "approve" ? "approved" : "denied");
  }

  if (status === "loading" && !orgName) {
      return <div className="max-w-md mx-auto mt-12 p-6 border rounded"><p>Loading...</p></div>;
  }
  
  if (status === "invalid") {
    return <div className="max-w-md mx-auto mt-12 p-6 border rounded"><p>This verification link is invalid or has expired.</p></div>;
  }

  if (status === "approved") {
    return <div className="max-w-md mx-auto mt-12 p-6 border rounded"><p>✅ Verification approved. You may close this page.</p></div>;
  }

  if (status === "denied") {
    return <div className="max-w-md mx-auto mt-12 p-6 border rounded"><p>❌ Verification denied. You may close this page.</p></div>;
  }
  
  if (status === "error") {
    return <div className="max-w-md mx-auto mt-12 p-6 border rounded"><p>An unexpected error occurred. Please try again later.</p></div>;
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded shadow-lg">
      <h1 className="text-xl font-semibold mb-2">
        Verify Rental Request
      </h1>

      <p className="text-sm text-gray-700 mb-6">
        <strong className="font-bold">{orgName}</strong> is requesting verification
        before handing over keys.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => respond("approve")}
          className="flex-1 bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          Approve
        </button>
        <button
          onClick={() => respond("deny")}
          className="flex-1 bg-red-600 text-white p-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
        >
          Deny
        </button>
      </div>
       <p className="text-xs text-gray-500 mt-4">
        This action is final and recorded for security purposes.
      </p>
    </div>
  );
}
