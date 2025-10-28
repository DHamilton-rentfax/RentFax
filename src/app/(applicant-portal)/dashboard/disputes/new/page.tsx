'use client';
import { useState } from "react";
import { db } from "@/firebase/client";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewDisputePage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ reportId: "", reason: "", details: "" });
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await addDoc(collection(db, "disputes"), {
      renterEmail: user?.email,
      reportRef: form.reportId,
      reason: form.reason,
      details: form.details,
      status: "pending",
      createdAt: Timestamp.now(),
    });
    setSuccess(true);
    setForm({ reportId: "", reason: "", details: "" });
  }

  if (success) return <p className="text-green-600">Dispute submitted!</p>;

  return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold mb-4">Submit Dispute</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          placeholder="Report ID"
          value={form.reportId}
          onChange={(e) => setForm({ ...form, reportId: e.target.value })}
          required
        />
        <Input
          placeholder="Reason"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
          required
        />
        <textarea
          placeholder="Details"
          className="w-full border p-2 rounded"
          value={form.details}
          onChange={(e) => setForm({ ...form, details: e.target.value })}
        />
        <Button type="submit">Submit Dispute</Button>
      </form>
    </div>
  );
}
