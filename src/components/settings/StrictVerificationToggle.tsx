'use client';

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function StrictVerificationToggle({ companyId, initialValue }: { companyId: string, initialValue: boolean }) {
  const [isStrict, setIsStrict] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = async (checked: boolean) => {
    setIsLoading(true);
    try {
      // API call to update the company's setting
      await fetch(`/api/company/${companyId}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strictVerification: checked }),
      });
      setIsStrict(checked);
    } catch (error) {
      console.error("Failed to update setting:", error);
      // Revert the switch on error
      setIsStrict(!checked);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="strict-verification"
        checked={isStrict}
        onCheckedChange={handleChange}
        disabled={isLoading}
      />
      <Label htmlFor="strict-verification">Require renters to be identity-verified before they can dispute incidents.</Label>
    </div>
  );
}
