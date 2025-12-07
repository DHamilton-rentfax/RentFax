"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function HousingIncidentForm() {
  const [incidentType, setIncidentType] = useState("");
  const [details, setDetails] = useState("");
  const [amount, setAmount] = useState("");
  const [hasUnauthorizedOccupants, setHasUnauthorizedOccupants] = useState(false);
  const [unauthorizedDetails, setUnauthorizedDetails] = useState("");

  async function submit() {
    await fetch("/api/housing/incidents/new", {
      method: "POST",
      body: JSON.stringify({
        incidentType,
        details,
        amount,
        hasUnauthorizedOccupants,
        unauthorizedDetails,
      }),
    });
    alert("Incident submitted");
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium">Incident Type</label>
        <select
          className="w-full border p-3 rounded mt-2"
          value={incidentType}
          onChange={(e) => setIncidentType(e.target.value)}
        >
          <option value="">Select one...</option>
          <option value="PROPERTY_DAMAGE">Property Damage</option>
          <option value="UNPAID_RENT">Unpaid Rent</option>
          <option value="LATE_PAYMENT">Late Payment</option>
          <option value="PET_VIOLATION">Unauthorized Pet</option>
          <option value="UNAUTHORIZED_OCCUPANTS">Unauthorized Occupants</option>
          <option value="POLICE_VISIT">Police Called</option>
          <option value="LEASE_VIOLATION">Lease Violation</option>
        </select>
      </div>

      {/* Conditional Expansion */}
      {incidentType === "UNAUTHORIZED_OCCUPANTS" && (
        <div>
          <label className="text-sm font-medium">Describe unauthorized occupants</label>
          <textarea
            className="w-full border p-3 rounded mt-2 h-32"
            value={unauthorizedDetails}
            onChange={(e) => setUnauthorizedDetails(e.target.value)}
          />
        </div>
      )}

      <div>
        <label className="text-sm font-medium">Details</label>
        <textarea
          className="w-full border p-3 rounded mt-2 h-40"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Financial Amount (if any)</label>
        <input
          className="w-full border p-3 rounded mt-2"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <Button className="w-full" onClick={submit}>
        Submit Incident
      </Button>
    </div>
  );
}
