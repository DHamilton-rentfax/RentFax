
"use client";

import { Button } from "@/components/ui/button";
import { ShieldCheck, Send } from "lucide-react";

export default function MatchFoundScreen({
  result,
  onProceedIdentityCheck,
  onSendSelfVerification,
}: {
  result: any;
  onProceedIdentityCheck: () => void;
  onSendSelfVerification: () => void;
}) {
  return (
    <div className="space-y-6 px-4">
      <div className="p-4 border rounded-xl bg-white shadow-sm">
        <h3 className="text-lg font-semibold">Match Found</h3>
        <p className="text-sm text-muted-foreground">(Step 2 of 3)</p>

        <div className="mt-4 space-y-1 text-sm">
          <p><strong>Name:</strong> {result?.publicProfile?.name || "—"}</p>
          <p><strong>Email:</strong> {result?.publicProfile?.email || "—"}</p>
          <p><strong>Phone:</strong> {result?.publicProfile?.phone || "—"}</p>
          <p><strong>Address:</strong> {result?.publicProfile?.address || "—"}</p>
        </div>
      </div>

      <div className="p-4 border rounded-xl bg-white shadow-sm">
        <h3 className="flex items-center gap-2 text-md font-semibold">
          <ShieldCheck size={18} /> Why Identity Verification Matters
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Every RentFAX report must be tied to a real, verified person — ensuring fairness,
          accuracy, and protection from fraud.
        </p>
      </div>

      <Button
        className="w-full py-6 text-lg"
        onClick={onProceedIdentityCheck}
      >
        Proceed to Identity Check ($4.99)
      </Button>

      <Button
        variant="outline"
        className="w-full justify-center py-6"
        onClick={onSendSelfVerification}
      >
        <Send className="mr-2 h-4 w-4" /> Send Self-Verification to Renter
      </Button>
    </div>
  );
}
