"use client";

import { Card } from "@/components/ui/card";

export function KanbanDealCard({ deal }: { deal: any }) {
  return (
    <Card className="p-3 hover:bg-accent transition cursor-grab active:cursor-grabbing">
      <div className="font-semibold">{deal.companyName}</div>
      <div className="text-xs text-muted-foreground">MRR: ${deal.amountMonthly?.toLocaleString()}</div>
      <div className="text-[10px] text-muted-foreground mt-1">Stage: {deal.stage}</div>
    </Card>
  );
}
