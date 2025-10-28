'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function VerifyPartnerModal({ partner, onClose }: { partner: any; onClose: () => void }) {
  const [status, setStatus] = useState(partner.verificationStatus || "pending");
  const [notes, setNotes] = useState(partner.verificationNotes || "");
  const [publicEvidence, setPublicEvidence] = useState(partner.publicEvidence || [""]);

  async function handleSave() {
    const res = await fetch(`/api/admin/verify-partner`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: partner.uid,
        role: partner.role,
        verificationStatus: status,
        verificationNotes: notes,
        publicEvidence,
      }),
    });
    const data = await res.json();
    if (data.success) onClose();
    else alert("Verification update failed.");
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle>Verify Partner: {partner.companyName || partner.firmName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Email: {partner.email}</p>
          <p className="text-sm text-gray-600">License / Bar Number: {partner.license || partner.barNumber}</p>

          {partner.docUrl && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 font-medium mb-1">Uploaded Document:</p>
              <a
                href={partner.docUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm underline"
              >
                View Uploaded File
              </a>
            </div>
          )}

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded-md p-2"
          >
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>

          <Textarea
            placeholder="Verification notes or findings..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          {publicEvidence.map((url, i) => (
            <Input
              key={i}
              placeholder="Public Evidence URL (Google / State Bar / Website)"
              value={url}
              onChange={(e) => {
                const updated = [...publicEvidence];
                updated[i] = e.target.value;
                setPublicEvidence(updated);
              }}
            />
          ))}

          <Button
            onClick={() => setPublicEvidence([...publicEvidence, ""])}
            variant="outline"
            size="sm"
          >
            + Add Another Link
          </Button>

          <Button onClick={handleSave} className="w-full bg-blue-600 text-white">
            Save Verification
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
