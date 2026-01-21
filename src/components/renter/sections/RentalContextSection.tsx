"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  rentalType: "car" | "equipment" | "home";
  setRentalType: (v: "car" | "equipment" | "home") => void;
  startDate: string;
  endDate: string;
  completed: boolean | null;
  setStartDate: (v: string) => void;
  setEndDate: (v: string) => void;
  setCompleted: (v: boolean) => void;
};

export default function RentalContextSection({
  rentalType,
  setRentalType,
  startDate,
  endDate,
  completed,
  setStartDate,
  setEndDate,
  setCompleted,
}: Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Rental Context</h2>

      <div className="flex gap-2">
        {["car", "equipment", "home"].map((type) => (
          <Button
            key={type}
            variant={rentalType === type ? "default" : "outline"}
            onClick={() => setRentalType(type as any)}
          >
            {type.toUpperCase()}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Rental Start Date</Label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <Label>Rental End Date</Label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-4 pt-2">
        <Button
          variant={completed === true ? "default" : "outline"}
          onClick={() => setCompleted(true)}
        >
          Completed as agreed
        </Button>

        <Button
          variant={completed === false ? "destructive" : "outline"}
          onClick={() => setCompleted(false)}
        >
          Issues occurred
        </Button>
      </div>
    </div>
  );
}
