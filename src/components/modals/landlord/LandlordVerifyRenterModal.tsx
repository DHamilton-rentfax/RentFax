"use client";

import { Button } from "@/components/ui/button";
import { ShieldCheck, Loader2 } from "lucide-react";
import { useState } from "react";

export default function LandlordVerifyRenterModal({ renterId, close }) {
  const [loading, setLoading] = useState(false);

  const verify = async () => {
    setLoading(true);

    await fetch("/api/landlord/renters/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ renterId }),
    });

    setLoading(false);
    close();
  };

  return (
    <div className="space-y-6 text-center">
      <ShieldCheck className="h-10 w-10 mx-auto text-green-600" />

      <h2 className="text-xl font-semibold">Verify Renter Identity</h2>

      <p className="text-gray-600 text-sm">
        Identity verification checks for fraud signals and cross-database conflicts.
      </p>

      <Button className="w-full" onClick={verify} disabled={loading}>
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify Renter"}
      </Button>

      <Button variant="outline" className="w-full" onClick={close}>
        Cancel
      </Button>
    </div>
  );
}
