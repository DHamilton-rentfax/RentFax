"use client";

import { useState } from "react";
import { db } from "@/firebase/client";
import { doc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";

interface Props {
  company: any;
  onUpdate?: () => void;
}

export default function VerifyCompanyPanel({ company, onUpdate }: Props) {
  const [loading, setLoading] = useState(false);

  if (!company) return null;

  async function approve() {
    setLoading(true);
    await updateDoc(doc(db, "companies", company.id), {
      verified: true,
      verifiedAt: new Date(),
    });
    setLoading(false);
    onUpdate?.();
  }

  return (
    <div className="border p-4 rounded-xl space-y-2 bg-white shadow-sm">
      {!company.verified ? (
        <>
          <p className="text-gray-700">
            This company is pending verification.
          </p>
          <Button disabled={loading} onClick={approve}>{
            loading ? "Approving..." : "Approve Company"}</Button>
        </>
      ) : (
        <p className="text-green-600 font-medium">
          Company verified ✔
        </p>
      )}
    </div>
  );
}
