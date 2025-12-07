"use client";

import { useState } from "react";

export default function VehicleDamageSection() {
  const [damageType, setDamageType] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Provide factual details about any physical damage to the vehicle.
      </p>

      <div>
        <label className="text-sm font-medium">Type of Damage</label>
        <select
          className="w-full border rounded-md p-2 mt-1"
          value={damageType}
          onChange={(e) => setDamageType(e.target.value)}
        >
          <option value="">Select one…</option>
          <option>Exterior - Body Panel Damage</option>
          <option>Glass - Window / Windshield</option>
          <option>Interior - Upholstery</option>
          <option>Interior - Burn Holes / Smoking</option>
          <option>Tires / Rims</option>
          <option>Mechanical Issue</option>
          <option>Other</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Describe the Damage</label>
        <textarea
          className="w-full border rounded-md p-2 mt-1"
          rows={4}
          placeholder="Provide a factual description of the damage."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">
          Upload Damage Evidence (photos, videos)
        </label>
        <div className="border rounded-md p-3 bg-muted/40 text-sm text-muted-foreground">
          EvidenceUploader will be inserted here (Chunk 3)
        </div>
      </div>
    </div>
  );
}