"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Home, AlertOctagon } from "lucide-react";

export type HousingConditionState = {
  unauthorizedOccupants: boolean;
  smoking: boolean;
  propertyDamage: boolean;
  excessiveFilth: boolean;
  infestation: boolean;
  noiseComplaints: boolean;
  leaseViolation: boolean;
  earlyAbandonment: boolean;
  evictionInitiated: boolean;
  balanceOwed: string;
  notes: string;
};

type Props = {
  state: HousingConditionState;
  onStateChange: (v: Partial<HousingConditionState>) => void;
};

const CHECKS = [
  { id: "unauthorizedOccupants", label: "Unauthorized occupants" },
  { id: "smoking", label: "Smoking inside property" },
  { id: "propertyDamage", label: "Property damage" },
  { id: "excessiveFilth", label: "Excessive filth / sanitation issues" },
  { id: "infestation", label: "Pest or infestation caused" },
  { id: "noiseComplaints", label: "Noise or neighbor complaints" },
  { id: "leaseViolation", label: "Lease or house rule violations" },
  { id: "earlyAbandonment", label: "Property abandoned early" },
  { id: "evictionInitiated", label: "Eviction process initiated" },
] as const;

export default function HousingConditionSection({
  state,
  onStateChange,
}: Props) {
  return (
    <div className="space-y-4 rounded-md border border-gray-200 p-4">
      <h3 className="font-semibold flex items-center gap-2">
        <Home className="h-5 w-5 text-gray-600" />
        Housing Condition & Conduct
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CHECKS.map(({ id, label }) => (
          <div key={id} className="flex items-center gap-2">
            <Checkbox
              checked={state[id]}
              onCheckedChange={(v) =>
                onStateChange({ [id]: Boolean(v) })
              }
            />
            <Label className="text-sm">{label}</Label>
          </div>
        ))}
      </div>

      <div className="space-y-2 rounded-lg bg-gray-50 p-3 ring-1 ring-gray-200">
        <Label>Outstanding Balance (if any)</Label>
        <Input
          placeholder="e.g. 1200"
          value={state.balanceOwed}
          onChange={(e) =>
            onStateChange({ balanceOwed: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Additional Notes (Optional)</Label>
        <Textarea
          placeholder="Describe any violations, damages, or conditions observed."
          value={state.notes}
          onChange={(e) => onStateChange({ notes: e.target.value })}
        />
      </div>

      <div className="flex items-start gap-2 text-xs text-gray-500">
        <AlertOctagon className="h-4 w-4 mt-0.5" />
        <span>
          Reports may be reviewed. Ensure accuracy and documentation.
        </span>
      </div>
    </div>
  );
}
