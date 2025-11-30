"use client";

import { Button } from "@/components/ui/button";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function CompanyVerificationModal({
  companyId,
  close,
}) {
  const verify = async () => {
    await fetch("/api/company/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId }),
    });

    close();
  };

  return (
    <div className="space-y-6 text-center">
      <ShieldCheck className="h-10 w-10 mx-auto text-green-600" />

      <h2 className="text-xl font-semibold">
        Verify Company Account
      </h2>

      <p className="text-gray-600 text-sm">
        Verification allows this company full rental operations across RentFAX.
      </p>

      <Button className="w-full" onClick={verify}>
        Verify Company
      </Button>

      <Button variant="outline" className="w-full" onClick={close}>
        Cancel
      </Button>
    </div>
  );
}
