"use client";

import { updateDeal } from "@/actions/sales/deals";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const stages = [
  "new",
  "qualified",
  "demo",
  "proposal",
  "negotiation",
  "won",
  "lost",
];

export function DealStageSelect({ dealId, value }: { dealId: string; value: string }) {
  return (
    <Select
      defaultValue={value}
      onValueChange={(stage) => updateDeal(dealId, { stage })}
    >
      <SelectTrigger>
        <SelectValue placeholder="Stage" />
      </SelectTrigger>

      <SelectContent>
        {stages.map((s) => (
          <SelectItem key={s} value={s}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
