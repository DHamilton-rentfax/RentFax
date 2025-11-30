"use client";

import { Zap } from "lucide-react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plan, CompanyStatus } from "@/lib/plan-features";

interface PaywallProps {
  currentPlan: Plan;
  currentStatus: CompanyStatus;
  featureName: string;
}

export default function Paywall({
  currentPlan,
  currentStatus,
  featureName,
}: PaywallProps) {
  const featureTitle = featureName
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <Card className="bg-secondary border-primary/50">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4 text-primary">
          <Zap className="w-12 h-12" />
        </div>
        <CardTitle className="font-headline text-2xl">
          Upgrade to Unlock "{featureTitle}"
        </CardTitle>
        <CardDescription>
          This feature is not available on your current plan.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p>
          Your current plan:{" "}
          <span className="font-bold capitalize">{currentPlan}</span>
          {currentStatus !== "active" && (
            <span className="font-bold capitalize text-destructive ml-2">
              ({currentStatus})
            </span>
          )}
        </p>
        <Button asChild>
          <Link href="/settings/billing">Upgrade Your Plan</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
