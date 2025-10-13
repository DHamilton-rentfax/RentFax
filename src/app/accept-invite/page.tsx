"use client";

import { useState } from "react";

export default function AcceptInvitePage() {
  const [inviteId, setInviteId] = useState("");
  const [loading, setLoading] = useState(false);

  async function acceptInvite() {
    setLoading(true);
    const res = await fetch("/api/accept-invite", {
      method: "POST",
      body: JSON.stringify({
        inviteId,
        userId: "authedUser123", // replace with real UID from useAuth
        email: "authedEmail@test.com",
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      alert("Invite accepted! You’ve joined the team.");
    } else {
      alert("Error: " + data.error);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Accept Invitation</h1>
      <input
        type="text"
        placeholder="Paste invite ID"
        className="border px-3 py-2 rounded w-64 mt-4"
        value={inviteId}
        onChange={(e) => setInviteId(e.target.value)}
      />
      <button
        onClick={acceptInvite}
        disabled={loading}
        className="ml-2 bg-green-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Joining..." : "Join Team"}
      </button>
    </div>
  );
}
