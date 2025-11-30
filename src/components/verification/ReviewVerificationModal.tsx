"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { db } from "@/firebase/client";
import { doc, updateDoc, addDoc, collection } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function ReviewVerificationModal({
  renter,
  onClose,
}: {
  renter: any;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");

  if (!user) return null;

  const files = renter.verificationFiles ?? {};

  const updateStatus = async (status: "BASIC" | "UNVERIFIED") => {
    if (!user) return;

    setLoading(true);
    try {
      const renterRef = doc(db, "renters", renter.id);

      await updateDoc(renterRef, {
        verificationStatus: status,
        verificationReviewedAt: new Date().toISOString(),
        verificationReviewedBy: user.uid,
        verificationNotes: notes,
      });

      await addDoc(collection(db, "auditLogs"), {
        action: "VERIFICATION_REVIEW",
        renterId: renter.id,
        status,
        reviewerId: user.uid,
        notes,
        timestamp: new Date().toISOString(),
      });

      onClose();
    } catch (err) {
      console.error("Verification review error:", err);
      alert("There was an error updating the verification status.");
    }

    setLoading(false);
  };

  const FilePreview = ({ label, url }: { label: string; url?: string }) =>
    url ? (
      <div className="space-y-1">
        <div className="text-sm font-medium">{label}</div>
        <img src={url} alt={label} className="rounded border" />
      </div>
    ) : null;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Review Verification</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FilePreview label="Selfie" url={files.selfieUrl} />
          <FilePreview label="ID Front" url={files.idFrontUrl} />
          <FilePreview label="ID Back" url={files.idBackUrl} />
          <FilePreview label="Address Proof" url={files.addressProofUrl} />
        </div>

        <textarea
          placeholder="Reviewer notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border rounded p-2 text-sm mt-4"
        />

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="destructive"
            disabled={loading}
            onClick={() => updateStatus("UNVERIFIED")}
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Reject"}
          </Button>

          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={loading}
            onClick={() => updateStatus("BASIC")}
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Approve"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
