"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquareWarning } from "lucide-react";

export default function LandlordDisputeModal({ disputeId, close }) {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);

    await fetch("/api/landlord/disputes/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ disputeId, response }),
    });

    setLoading(false);
    close();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquareWarning className="h-6 w-6 text-orange-600" />
        <h2 className="text-xl font-semibold">Respond to Dispute</h2>
      </div>

      <Textarea
        placeholder="Write your response..."
        className="w-full h-32"
        value={response}
        onChange={(e) => setResponse(e.target.value)}
      />

      <Button className="w-full" onClick={submit} disabled={loading}>
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Submit Response"}
      </Button>

      <Button variant="outline" className="w-full" onClick={close}>
        Cancel
      </Button>
    </div>
  );
}
