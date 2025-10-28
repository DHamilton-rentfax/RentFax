"use client";

import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export function VerifyCompanyPanel({ company, onUpdate }: { company: any, onUpdate: (updatedData?: any) => void }) {
  const { user } = useAuth();

  const handleVerify = async () => {
    if (!company?.id) return;
    const ref = doc(db, "companies", company.id);
    const updatedData = {
      verified: true,
      verificationLevel: 3, // Manual verification is the highest level
      verificationSource: "manual",
      verifiedBy: user?.uid,
      verifiedAt: Timestamp.now(),
    };
    await updateDoc(ref, updatedData);
    onUpdate(updatedData);
    alert(`${company.name} has been manually verified.`);
  };

  const handleRevoke = async () => {
    if (!company?.id) return;
    const ref = doc(db, "companies", company.id);
    const updatedData = {
      verified: false,
      verificationLevel: 0,
      verifiedBy: null,
      verifiedAt: null,
      verificationSource: null,
      verificationResponse: null, // Clear trulioo response
    };
    await updateDoc(ref, updatedData);
    onUpdate(updatedData);
    alert(`Verification for ${company.name} has been revoked.`);
  };

  const handleTruliooVerify = async () => {
    if (!company?.id) return;
    try {
      const res = await fetch("/api/verify/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: company.id,
          companyName: company.name,
          registrationNumber: company.registrationNumber,
          country: company.country || "US",
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(
          data.skipped
            ? "Trulioo verification skipped (API key not set)."
            : data.verified
            ? "✅ Company verified via Trulioo."
            : "⚠️ No match found via Trulioo. Manual review needed."
        );
        // Trigger a refresh on the parent page
        onUpdate();
      } else {
        alert("Trulioo verification failed. See console for details.");
        console.error("Trulioo API response:", data);
      }
    } catch (error) {
        alert("An error occurred while calling the verification API.");
        console.error("handleTruliooVerify error:", error);
    }
  };
  
  return (
    <div className="flex flex-col gap-2 items-end w-full md:w-auto">
      <div className="text-xs text-gray-500 text-right">
        Source: {company.verificationSource ?? "None"} 
        (Level: {company.verificationLevel ?? 0})
        {company.verifiedAt && ` on ${new Date(company.verifiedAt.seconds * 1000).toLocaleDateString()}`}
      </div>
      <div className="flex gap-2 mt-1">
        <Button onClick={handleTruliooVerify} variant="outline" size="sm">
          Run Trulioo Check
        </Button>
        {company.verified ? (
           <Button onClick={handleRevoke} size="sm" variant="destructive">
             Revoke
           </Button>
        ) : (
           <Button onClick={handleVerify} size="sm" className="bg-green-600 hover:bg-green-700 text-white">
             <CheckCircle2 className="h-4 w-4 mr-1" />
             Manual Verify
           </Button>
        )}
      </div>
    </div>
  );
}
