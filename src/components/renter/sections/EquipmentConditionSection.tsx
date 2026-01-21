"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Wrench, AlertTriangle } from "lucide-react";

export type EquipmentConditionState = {
  damaged: boolean;
  misuse: boolean;
  missingParts: boolean;
  unauthorizedOperator: boolean;
  lateReturn: boolean;
  repairRequired: boolean;
  estimatedCost: string;
  notes: string;
};

type Props = {
  state: EquipmentConditionState;
  onStateChange: (v: Partial<EquipmentConditionState>) => void;
};

const CHECKS = [
  { id: "damaged", label: "Equipment damaged" },
  { id: "misuse", label: "Misused outside agreement" },
  { id: "missingParts", label: "Missing components or accessories" },
  { id: "unauthorizedOperator", label: "Unauthorized operator used equipment" },
  { id: "lateReturn", label: "Returned late" },
  { id: "repairRequired", label: "Repair required after return" },
] as const;

export default function EquipmentConditionSection({
  state,
  onStateChange,
}: Props) {
  return (
    <div className="space-y-4 rounded-md border border-gray-200 p-4">
      <h3 className="font-semibold flex items-center gap-2">
        <Wrench className="h-5 w-5 text-gray-600" />
        Equipment Condition & Usage
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

      {state.repairRequired && (
        <div className="space-y-2 rounded-lg bg-gray-50 p-3 ring-1 ring-gray-200">
          <Label>Estimated Repair Cost (USD)</Label>
          <Input
            placeholder="e.g. 850"
            value={state.estimatedCost}
            onChange={(e) =>
              onStateChange({ estimatedCost: e.target.value })
            }
          />
        </div>
      )}

      <div className="space-y-2">
        <Label>Additional Notes (Optional)</Label>
        <Textarea
          placeholder="Describe the condition, misuse, or damages observed."
          value={state.notes}
          onChange={(e) => onStateChange({ notes: e.target.value })}
        />
      </div>

      <div className="flex items-start gap-2 text-xs text-gray-500">
        <AlertTriangle className="h-4 w-4 mt-0.5" />
        <span>
          Only report issues you can substantiate with documentation or photos.
        </span>
      </div>
    </div>
  );
}
