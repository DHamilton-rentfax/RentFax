"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type Props = {
  renterId: string;
  currentStatus: "PENDING" | "APPROVED" | "REJECTED";
  currentNotes: string;
};

export default function IdentityOverridePanel({
  renterId,
  currentStatus,
  currentNotes,
}: Props) {
  const { toast } = useToast();
  const [status, setStatus] = useState<Props["currentStatus"]>(currentStatus);
  const [notes, setNotes] = useState(currentNotes);
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  async function handleAction(action: "approve" | "reject") {
    try {
      setLoading(action);
      const res = await fetch(`/api/admin/verification/${action}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ renterId, notes }),
        });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to ${action} verification`);
      }

      const newStatus = action === "approve" ? "APPROVED" : "REJECTED";
      setStatus(newStatus);

      toast({
        title: `Verification ${newStatus.toLowerCase()}`,
        description:
          action === "approve"
            ? "Renter has been marked as verified."
            : "Renter has been rejected. They will see this in their portal.",
      });
    } catch (e: any) {
      console.error(`Error in ${action} override:`, e);
      toast({
        title: "Error",
        description: e?.message ?? "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Manual Override</h2>
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            status === "APPROVED"
              ? "bg-green-100 text-green-800"
              : status === "REJECTED"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {status}
        </span>
      </div>

      <p className="text-xs text-gray-600">
        Use this when automated signals are not enough. Your decision and notes
        will be logged in the audit trail and visible to internal staff.
      </p>

      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700">
          Admin Notes (required for APPROVE / REJECT)
        </label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Explain why you're approving or rejecting this renter..."
          className="min-h-[100px]"
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          disabled={loading !== null}
          onClick={() => {
            setStatus("PENDING");
            setNotes(currentNotes);
          }}
        >
          Reset
        </Button>
        <Button
          variant="destructive"
          disabled={loading === "approve" || !notes.trim()}
          onClick={() => handleAction("reject")}
        >
          {loading === "reject" ? "Rejecting..." : "Reject"}
        </Button>
        <Button
          disabled={loading === "reject" || !notes.trim()}
          onClick={() => handleAction("approve")}
        >
          {loading === "approve" ? "Approving..." : "Approve"}
        </Button>
      </div>
    </div>
  );
}
