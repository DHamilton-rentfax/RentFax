"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { auth } from "@/firebase/client";
import * as React from "react";

export default function InvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orgId = searchParams.get("orgId");
  const inviteId = searchParams.get("inviteId");

  const [invite, setInvite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchInvite() {
      if (!orgId || !inviteId) return;
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(
        `/api/team/invite-status?orgId=${orgId}&inviteId=${inviteId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (res.ok) {
        setInvite(data.invite);
      } else {
        setError(data.error || "Invalid invite.");
      }
      setLoading(false);
    }
    fetchInvite();
  }, [orgId, inviteId]);

  async function acceptInvite() {
    const token = await auth.currentUser?.getIdToken();
    const res = await fetch("/api/team/accept-invite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ orgId, inviteId }),
    });
    if (res.ok) {
      router.push("/dashboard");
    } else {
      const data = await res.json();
      setError(data.error || "Could not accept invite.");
    }
  }

  if (loading) return <p>Loading invite...</p>;

  if (error === "Invite expired") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="max-w-md w-full bg-white border rounded shadow p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">❌ Invite Expired</h1>
          <p className="mb-4 text-gray-600">
            This invite is no longer valid. Please request a new invite from
            your org admin.
          </p>
        </div>
      </div>
    );
  }

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-md w-full bg-white border rounded shadow p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Join {orgId}</h1>
        <p className="mb-4">
          You’ve been invited as <strong>{invite?.role}</strong>.
        </p>
        <button
          onClick={acceptInvite}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Accept Invite
        </button>
      </div>
    </div>
  );
}
