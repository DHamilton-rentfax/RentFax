"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

export default function ScreenPage() {
  const [renterInfo, setRenterInfo] = useState("");
  const { user } = useAuth();

  const handleScreen = async () => {
    // 1. Validate renterInfo (e.g., is it a valid email or ID?)
    // For now, we'll assume it's valid.

    // 2. Check if user is logged in and has a subscription
    if (user) {
      // TODO: Check for active subscription
      // If subscribed, redirect to the report page:
      // router.push(`/report/${renterInfo}`);
      alert("You are logged in. Redirecting to the report...");
    } else {
      // 3. If not logged in or no subscription, proceed to payment
      const response = await fetch("/api/checkout/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          lookup_key: "price_screening_20usd",
          renterInfo: renterInfo
        }),
      });

      const { url } = await response.json();
      window.location.href = url;
    }
  };

  return (
    <div className="container mx-auto py-12">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Screen a Renter</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Enter the renter's email address or a RentFAX Report ID to begin.
          </p>
          <div className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="Email or Report ID"
              value={renterInfo}
              onChange={(e) => setRenterInfo(e.target.value)}
            />
            <Button onClick={handleScreen}>Start Screening</Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            You will be prompted for a one-time $20 payment if you do not have an active subscription.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
