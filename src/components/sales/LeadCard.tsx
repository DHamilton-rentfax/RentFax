"use client";

import { Card } from "@/components/ui/card";

export function LeadCard({ lead }: { lead: any }) {
  return (
    <Card className="p-4 hover:bg-muted transition rounded-md">
      <div className="font-semibold text-lg">{lead.name}</div>
      <div className="text-sm text-muted-foreground">{lead.companyName}</div>
      <div className="text-xs mt-1">Status: {lead.status}</div>
    </Card>
  );
}
