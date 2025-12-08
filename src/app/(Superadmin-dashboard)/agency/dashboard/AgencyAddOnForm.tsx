"use client";

import { useState } from "react";
import { doc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";

import { db } from "@/firebase/client";
import { useAuth } from "@/hooks/use-auth";

interface Props {
  reportId: string;
  currentStatus?: string;
  renterName?: string;
}

export default function AgencyAddOnForm({ reportId, currentStatus, renterName }: Props) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    status: currentStatus || "in_collections",
    note: "",
    balanceRemaining: "",
    resolved: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("You must be logged in as an agency user.");
    if (!form.note.trim()) return toast.error("Please add a note before submitting.");

    setLoading(true);
    try {
      const ref = doc(db, "rentalReports", reportId);
      await updateDoc(ref, {
        agencyAddOns: arrayUnion({
          addedBy: user.uid,
          note: form.note,
          balanceRemaining: form.balanceRemaining || null,
          status: form.status,
          resolved: form.resolved,
          timestamp: serverTimestamp(),
        }),
        status: form.resolved ? "resolved" : form.status,
        updatedAt: serverTimestamp(),
      });

      toast.success("Agency update added successfully.");
      setForm({ ...form, note: "", balanceRemaining: "" });
    } catch (err) {
      console.error(err);
      toast.error("Error adding update.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 mt-6 space-y-4 border border-gray-100">
      <h3 className="text-xl font-semibold text-[#1A2540]">Agency Add-On</h3>
      {renterName && <p className="text-gray-600 text-sm mb-2">Report for: {renterName}</p>}

      <div>
        <label className="block text-sm font-semibold mb-1">Status Update</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="border p-2 rounded-md w-full"
        >
          <option value="in_collections">In Collections</option>
          <option value="resolved">Resolved</option>
          <option value="follow_up_required">Follow Up Required</option>
          <option value="returned_to_company">Returned to Company</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Balance Remaining ($)</label>
        <input
          type="number"
          name="balanceRemaining"
          value={form.balanceRemaining}
          onChange={handleChange}
          placeholder="0.00"
          className="border p-2 rounded-md w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Agency Note</label>
        <textarea
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="Add detailed update or communication log..."
          className="border p-2 rounded-md w-full min-h-[100px]"
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" name="resolved" checked={form.resolved} onChange={handleChange} />
        Mark this renter as resolved / balance cleared
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#1A2540] text-white font-semibold py-2 rounded-md hover:bg-[#2d3c66] transition"
      >
        {loading ? "Saving..." : "Submit Update"}
      </button>
    </form>
  );
}
