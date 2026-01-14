"use client";

import { useState } from "react";
import { doc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";

import { db } from "@/firebase/client";
import { useAuth } from "@/hooks/use-auth";

interface Props {
  reportNameId: string;
  renterName?: string;
  currentStatus?: string;
}

export default function LegalAddOnForm({ reportNameId, renterName, currentStatus }: Props) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    caseNumber: "",
    courtName: "",
    judgementActive: false,
    judgementResolved: false,
    settlementAmount: "",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("You must be logged in as a legal user.");
    if (!form.note.trim() && !form.caseNumber.trim()) {
      return toast.error("Please provide at least a case number or legal note.");
    }

    setSubmitting(true);
    try {
      const ref = doc(db, "rentalReports", reportNameId);
      await updateDoc(ref, {
        legalAddOns: arrayUnion({
          addedBy: user.uid,
          note: form.note,
          caseNumber: form.caseNumber,
          courtName: form.courtName,
          judgementActive: form.judgementActive,
          judgementResolved: form.judgementResolved,
          settlementAmount: form.settlementAmount || null,
          timestamp: serverTimestamp(),
        }),
        status: form.judgementActive
          ? "in_legal"
          : form.judgementResolved
          ? "resolved"
          : currentStatus || "pending_legal",
        updatedAt: serverTimestamp(),
      });

      toast.success("Legal update added successfully.");
      setForm({
        caseNumber: "",
        courtName: "",
        judgementActive: false,
        judgementResolved: false,
        settlementAmount: "",
        note: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Error submitting legal update.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-md p-6 mt-6 space-y-4 border border-gray-100"
    >
      <h3 className="text-xl font-semibold text-[#1A2540]">Legal Add-On</h3>
      {renterName && <p className="text-gray-600 text-sm mb-2">Report for: {renterName}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Case Number</label>
          <input
            name="caseNumber"
            value={form.caseNumber}
            onChange={handleChange}
            placeholder="e.g. 2025-CR-1457"
            className="border p-2 rounded-md w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Court Name</label>
          <input
            name="courtName"
            value={form.courtName}
            onChange={handleChange}
            placeholder="County Court / Civil Division"
            className="border p-2 rounded-md w-full"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Settlement Amount ($)</label>
        <input
          type="number"
          name="settlementAmount"
          value={form.settlementAmount}
          onChange={handleChange}
          placeholder="0.00"
          className="border p-2 rounded-md w-full"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="judgementActive"
            checked={form.judgementActive}
            onChange={handleChange}
          />
          Judgment Active / Legal Claim Ongoing
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="judgementResolved"
            checked={form.judgementResolved}
            onChange={handleChange}
          />
          Judgment Resolved / Paid Settlement
        </label>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Legal Note</label>
        <textarea
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="Describe legal action, judgment details, payment plan, etc."
          className="border p-2 rounded-md w-full min-h-[100px]"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#1A2540] text-white font-semibold py-2 rounded-md hover:bg-[#2d3c66] transition"
      >
        {submitting ? "Saving..." : "Submit Legal Update"}
      </button>
    </form>
  );
}
