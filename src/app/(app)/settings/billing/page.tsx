"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import Protected from "@/components/protected";
import Link from "next/link";

export default function BillingPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleRedirect = async () => {
    setLoading(true);
    try {
      if (!user?.email) throw new Error("User not found");
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Could not create a portal session.");
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <Protected roles={["owner", "manager", "pro"]}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold font-headline">
          Billing & Subscription
        </h1>
        <Card>
          <CardHeader>
            <CardTitle>Manage Subscription</CardTitle>
            <CardDescription>
              Update your payment method, view invoices, or cancel your
              subscription via our secure payment partner, Stripe.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleRedirect} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Open Customer Portal
            </Button>
            <Button asChild variant="outline">
              <Link href="/settings/billing/history">View Billing History</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Protected>
  );
}
