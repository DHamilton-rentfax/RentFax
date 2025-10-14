"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createDisputeAction } from "@/app/actions/create-dispute";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function NewDisputePage() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [renterId, setRenterId] = useState(""); // renter’s Firestore userId
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (!description || !renterId) {
      toast.error("Please fill in renter ID and description.");
      return;
    }

    startTransition(async () => {
      const res = await createDisputeAction({
        renterId,
        description,
        amount: parseFloat(amount),
      });

      if (res.success) toast.success("✅ Dispute created successfully!");
      else toast.error(`❌ Error: ${res.error}`);
    });
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">File a New Dispute</h1>

      <Input
        placeholder="Renter Firestore ID"
        value={renterId}
        onChange={(e) => setRenterId(e.target.value)}
        className="mb-3"
      />

      <Input
        placeholder="Dispute Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-3"
      />

      <Input
        placeholder="Disputed Amount ($)"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="mb-3"
      />

      <Button
        onClick={handleSubmit}
        disabled={isPending}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting...
          </>
        ) : (
          "Submit Dispute"
        )}
      </Button>
    </div>
  );
}
