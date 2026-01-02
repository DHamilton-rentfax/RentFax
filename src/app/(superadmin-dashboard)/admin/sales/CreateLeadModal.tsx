"use client";

import { useState } from "react";
import { createLead } from "@/app/actions/crm/create-lead";

export default function CreateLeadModal({ open, onClose }: { open: boolean, onClose: () => void}) {
  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    notes: "",
  });

  if (!open) return null;

  async function submit() {
    await createLead(form);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">New Lead</h2>

        <input
          placeholder="Company Name"
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, companyName: e.target.value })}
        />
        <input
          placeholder="Contact Name"
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, contactName: e.target.value })}
        />
        <input
          placeholder="Email"
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Phone"
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <textarea
          placeholder="Notes"
          className="w-full border p-2 rounded"
          rows={3}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />

        <button
          onClick={submit}
          className="w-full bg-black text-white py-2 rounded-lg"
        >
          Create Lead
        </button>
      </div>
    </div>
  );
}
