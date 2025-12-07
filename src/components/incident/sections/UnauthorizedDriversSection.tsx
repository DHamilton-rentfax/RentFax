"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedDriversSection() {
  const [drivers, setDrivers] = useState([
    { name: "", dob: "", license: "", state: "", relationship: "", notes: "" },
  ]);

  const updateDriver = (index: number, field: string, value: string) => {
    const copy = [...drivers];
    // @ts-ignore
    copy[index][field] = value;
    setDrivers(copy);
  };

  const addDriver = () => {
    setDrivers([
      ...drivers,
      { name: "", dob: "", license: "", state: "", relationship: "", notes: "" },
    ]);
  };

  const removeDriver = (index: number) => {
    setDrivers(drivers.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Add details for each unauthorized driver who operated the vehicle.
      </p>

      {drivers.map((driver, index) => (
        <div
          key={index}
          className="border rounded-lg p-4 bg-white space-y-4 shadow-sm"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Unauthorized Driver #{index + 1}</h3>
            {index > 0 && (
              <Button variant="destructive" size="sm" onClick={() => removeDriver(index)}>
                Remove
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Full Name"
              value={driver.name}
              onChange={(v) => updateDriver(index, "name", v)}
            />
            <Field
              label="Date of Birth (optional)"
              value={driver.dob}
              onChange={(v) => updateDriver(index, "dob", v)}
            />
            <Field
              label="Driver License Number"
              value={driver.license}
              onChange={(v) => updateDriver(index, "license", v)}
            />
            <Field
              label="State of Issue"
              value={driver.state}
              onChange={(v) => updateDriver(index, "state", v)}
            />
            <Field
              label="Relationship to renter"
              value={driver.relationship}
              onChange={(v) => updateDriver(index, "relationship", v)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Additional Notes</label>
            <textarea
              className="w-full border rounded-md p-2 mt-1"
              rows={3}
              placeholder="Describe how this person was identified, when they were seen driving, etc."
              value={driver.notes}
              onChange={(e) => updateDriver(index, "notes", e.target.value)}
            />
          </div>

          {/* Evidence uploader placeholder — real uploader in CHUNK 3 */}
          <div className="pt-2">
            <label className="text-sm font-medium block mb-1">
              Upload Evidence (ID photo, messages, photos of them driving)
            </label>
            <div className="border rounded-md p-3 bg-muted/40 text-sm text-muted-foreground">
              EvidenceUploader will be inserted here (Chunk 3)
            </div>
          </div>
        </div>
      ))}

      <Button variant="secondary" onClick={addDriver}>
        + Add Another Unauthorized Driver
      </Button>
    </div>
  );
}

function Field({ label, value, onChange }: any) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        className="w-full border rounded-md p-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}