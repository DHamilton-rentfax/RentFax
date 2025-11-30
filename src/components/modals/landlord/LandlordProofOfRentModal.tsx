"use client";

import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { useState } from "react";

export default function LandlordProofOfRentModal({ renterId, close }) {
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);

    const res = await fetch(`/api/renters/proof?renterId=${renterId}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");

    setLoading(false);
    close();
  };

  return (
    <div className="space-y-6 text-center">
      <FileText className="h-10 w-10 mx-auto text-indigo-600" />

      <h2 className="text-xl font-semibold">Generate Proof of Rent</h2>

      <p className="text-gray-600 text-sm">
        Produce a certified document showing payment history, disputes, and renter reputation score.
      </p>

      <Button className="w-full" disabled={loading} onClick={generate}>
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Generate PDF"}
      </Button>

      <Button variant="outline" className="w-full" onClick={close}>
        Cancel
      </Button>
    </div>
  );
}
