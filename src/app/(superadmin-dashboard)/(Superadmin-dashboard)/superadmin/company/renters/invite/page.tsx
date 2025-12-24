
"use client";

import { useState } from "react";

export default function CompanyInviteRenter() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [status, setStatus] = useState("");

  async function sendInvite() {
    const res = await fetch("/api/invite-verification", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const json = await res.json();
    if (json.success) setStatus("Invite sent!");
    else setStatus("Error sending invite");
  }

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        Send Verification Request to Renter
      </h1>

      <div className="space-y-4">
        <input
          className="border p-2 w-full rounded"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="border p-2 w-full rounded"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          className="border p-2 w-full rounded"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <button
          onClick={sendInvite}
          className="bg-blue-700 text-white px-6 py-2 rounded"
        >
          Send Verification Link
        </button>

        {status && <p className="text-green-600 mt-3">{status}</p>}
      </div>
    </div>
  );
}
