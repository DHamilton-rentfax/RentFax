"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateDisputeStatusAction } from "@/app/actions/update-dispute-status";
import { Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function DisputeDetailPage({ params }: { id: string } }) {
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [renterId, setRenterId] = useState(""); // renter's Firestore user ID
  const [isPending, startTransition] = useTransition();

  const handleUpdate = () => {
    if (!renterId) {
      toast.error("Please enter a valid renter ID before updating.");
      return;
    }

    startTransition(async () => {
      const res = await updateDisputeStatusAction({
        disputeId: params.id,
        status,
        note,
        renterId,
      });

      if (res.success) {
        toast.success("✅ Dispute updated and renter notified!");
      } else {
        toast.error(`❌ Update failed: ${res.error}`);
      }
    });
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Update Dispute</h1>

      <Input
        placeholder="New Status (e.g. Resolved, Under Review)"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="mb-3"
      />

      <Input
        placeholder="Optional note to renter"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="mb-3"
      />

      <Input
        placeholder="Renter Firestore ID"
        value={renterId}
        onChange={(e) => setRenterId(e.target.value)}
        className="mb-3"
      />

      <Button
        onClick={handleUpdate}
        disabled={isPending}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Updating...
          </>
        ) : (
          "Update & Notify Renter"
        )}
      </Button>

      {isPending && (
        <div className="flex items-center justify-center mt-3 text-gray-500 text-sm">
          <Loader2 className="animate-spin mr-2 w-4 h-4" />
          Processing update...
        </div>
      )}
    </div>
  );
}
