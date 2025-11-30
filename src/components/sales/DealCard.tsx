"use client";

import { Card } from "@/components/ui/card";

export function DealCard({ deal }: { deal: any }) {
  const mrr = deal.amountMonthly?.toLocaleString() || "0";

  return (
    <Card className="p-4 hover:bg-muted transition rounded-md">
      <div className="font-semibold text-lg">{deal.companyName}</div>
      <div className="text-sm text-muted-foreground">
        Stage: {deal.stage}
      </div>
      <div className="text-xs mt-2">MRR: ${mrr}</div>
    </Card>
  );
}
