"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Car,
  Check,
  Cigarette,
  Key,
  Wind,
  Wrench,
  Trash2,
} from "lucide-react";
import { useState } from "react";

// Represents the state for all possible car-related issues
export type CarConditionState = {
  smoking: boolean;
  smokingNotes: string;
  dirty: boolean;
  dirtyNotes: string;
  fuel: boolean;
  fuelNotes: string;
  driver: boolean;
  driverNotes: string;
  keys: boolean;
  keysNotes: string;
  tampering: boolean;
  tamperingNotes: string;
};

type Props = {
  state: CarConditionState;
  onStateChange: (newState: Partial<CarConditionState>) => void;
};

// UI Toggles for quick issue reporting
const TOGGLES = [
  { id: "smoking", icon: Cigarette, label: "Smoking in vehicle" },
  { id: "dirty", icon: Trash2, label: "Vehicle returned dirty" },
  { id: "fuel", icon: Wind, label: "Fuel below agreement" },
  { id: "driver", icon: Car, label: "Unauthorized driver" },
  { id: "keys", icon: Key, label: "Lost or damaged keys" },
  { id: "tampering", icon: Wrench, label: "Tampering suspected" },
] as const;

export default function CarConditionSection({ state, onStateChange }: Props) {
  const [showNotes, setShowNotes] = useState<keyof CarConditionState | null>(
    null
  );

  const handleToggle = (id: keyof CarConditionState) => {
    const currentState = state[id];
    onStateChange({ [id]: !currentState });
    if (!currentState) {
      setShowNotes(id); // Show notes when toggling on
    } else {
      setShowNotes(null); // Hide notes when toggling off
    }
  };

  const handleNotesChange = (
    id: keyof CarConditionState,
    value: string
  ) => {
    onStateChange({ [id]: value } as any);
  };

  return (
    <div className="space-y-4 rounded-md border border-gray-200 p-4">
      <h3 className="font-semibold text-md flex items-center gap-2">
        <Car size={20} className="text-gray-600" />
        Car Condition & Conduct
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {TOGGLES.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => handleToggle(id as any)}
            className={`flex items-center gap-3 rounded-lg p-3 text-left text-sm transition-all
              ${
                state[id]
                  ? "bg-blue-50 ring-2 ring-blue-500"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
          >
            <Icon
              className={`h-5 w-5 ${
                state[id] ? "text-blue-600" : "text-gray-500"
              }`}
            />
            <span
              className={`flex-1 font-medium ${
                state[id] ? "text-blue-900" : "text-gray-800"
              }`}
            >
              {label}
            </span>
          </button>
        ))}
      </div>

      {TOGGLES.map(
        ({ id, label }) =>
          state[id as keyof CarConditionState] && (
            <div
              key={`${id}-notes`}
              className="space-y-2 rounded-lg bg-gray-50 p-4 ring-1 ring-gray-100"
            >
              <Label htmlFor={`${id}-notes`} className="font-semibold">
                Notes for: "{label}" (Optional)
              </Label>
              <Textarea
                id={`${id}-notes`}
                placeholder={`e.g., "Vehicle smelled strongly of smoke. Ash found on seats."`}
                value={state[`${id}Notes` as keyof CarConditionState] as string}
                onChange={(e) =>
                  handleNotesChange(
                    `${id}Notes` as keyof CarConditionState,
                    e.target.value
                  )
                }
              />
            </div>
          )
      )}
    </div>
  );
}
