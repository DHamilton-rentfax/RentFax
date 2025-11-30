"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Loader2, ShieldX } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

// Define the structure for partner data
interface Partner {
  id: string;
  name: string;
}

// Define the props for the modal
export interface AdminVerifyPartnerModalProps {
  partner: Partner;
  close: () => void;
}

export default function AdminVerifyPartnerModal({
  partner,
  close,
}: AdminVerifyPartnerModalProps) {
  const { user } = useAuth();
  const [verifying, setVerifying] = useState(false);
  const [denying, setDenying] = useState(false);

  // Prop validation and role-gating
  if (!user || user.role !== "SUPER_ADMIN" || !partner?.id) {
    close();
    return null;
  }

  const handleAction = async (action: "verify" | "deny") => {
    const confirmationText = 
      action === "verify" 
      ? `Are you sure you want to verify ${partner.name}?`
      : `Are you sure you want to deny ${partner.name}? This action cannot be easily undone.`

    if (!window.confirm(confirmationText)) return;

    action === "verify" ? setVerifying(true) : setDenying(true);
    
    try {
      const res = await fetch(`/api/admin/partners/${action}` , {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: partner.id }),
      });

      if (!res.ok) {
        throw new Error(`Failed to ${action} partner`);
      }
      close();
    } catch (err) {
      console.error(`Partner ${action} error:`, err);
      // Optionally show an error message in the UI
    } finally {
      action === "verify" ? setVerifying(false) : setDenying(false);
    }
  };

  return (
    <div className="space-y-6" role="dialog" aria-modal="true">
      <div className="flex flex-col items-center text-center gap-2">
        <ShieldCheck className="h-10 w-10 text-green-600" />
        <h2 className="text-xl font-semibold">Verify Partner Account</h2>
        <p className="text-gray-600 text-sm">
          Approving <strong>{partner.name}</strong> will activate their full partner dashboard access.
        </p>
      </div>

      <div className="space-y-3 pt-2">
        <Button
          onClick={() => handleAction("verify")}
          className="w-full bg-green-600 hover:bg-green-700 flex gap-2"
          disabled={verifying || denying}
        >
          {verifying ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ShieldCheck className="h-4 w-4" />
          )}
          Verify & Approve Partner
        </Button>

        <Button
          onClick={() => handleAction("deny")}
          className="w-full flex gap-2"
          variant="destructive"
          disabled={verifying || denying}
        >
          {denying ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ShieldX className="h-4 w-4" />
          )}
          Deny Partner
        </Button>

        <Button variant="outline" className="w-full" onClick={close} disabled={verifying || denying}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
