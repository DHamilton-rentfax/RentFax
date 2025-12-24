'use client';
import { useState } from "react";
import { db } from "@/firebase/client";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RecommendedHelp from "@/components/support/RecommendedHelp";
import { HelpInline } from "@/components/support/HelpInline";

export default function NewDisputePage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ reportId: "", reason: "", details: "" });
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const missingEvidence = !form.details;
    if (missingEvidence) {
      window.dispatchEvent(
        new CustomEvent("openSupportModal", {
          detail: { context: "dispute_missing_evidence" },
        })
      );
      return;
    }

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

  if (success) {
    return (
        <div className="max-w-md mx-auto text-center py-10">
            <h2 className="text-2xl font-bold text-green-600 mb-2">Dispute Submitted!</h2>
            <p className="text-gray-600">We will review your submission and get back to you shortly.</p>
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
                <div className="flex items-center gap-x-3 mb-2">
                    <h2 className="text-2xl font-semibold">Submit a Dispute</h2>
                    <HelpInline context="dispute_workflow" />
                </div>
                <p className="text-sm text-gray-600 mb-6">
                    If you believe there is an error in your report, please provide the details below.
                    <button
                        onClick={() =>
                            window.dispatchEvent(
                            new CustomEvent("openSupportModal", { detail: { context: "explain_dispute_submission" } })
                            )
                        }
                        className="text-xs text-gray-600 underline ml-2"
                        >
                        Explain this step
                    </button>
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="Report ID or Eviction Case #"
                        value={form.reportId}
                        onChange={(e) => setForm({ ...form, reportId: e.target.value })}
                        required
                    />
                    <Input
                        placeholder="Reason for dispute (e.g., incorrect information)"
                        value={form.reason}
                        onChange={(e) => setForm({ ...form, reason: e.target.value })}
                        required
                    />
                    <textarea
                        placeholder="Please provide as much detail as possible to help us resolve this quickly."
                        className="w-full border p-2 rounded-md h-32 bg-gray-50"
                        value={form.details}
                        onChange={(e) => setForm({ ...form, details: e.target.value })}
                    />
                    <Button type="submit" className="w-full">
                        Submit Dispute for Review
                    </Button>
                </form>
            </div>
            <div className="mt-4 md:mt-0">
                <RecommendedHelp context="dispute_workflow" />
            </div>
        </div>
    </div>
  );
}
