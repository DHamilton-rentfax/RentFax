"use client";

import { Button } from "@/components/ui/button";

interface IncidentSummary {
  id: string;
  type?: string;
  status?: string;
  amount?: number;
  createdAt?: string;
  description?: string;
  [key: string]: any;
}

interface RenterIncidentDetailsModalProps {
  incident: IncidentSummary;
  close: () => void;
}

export default function RenterIncidentDetailsModal({
  incident,
  close,
}: RenterIncidentDetailsModalProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Incident Details</h2>

      <div className="space-y-1 text-sm">
        <p>
          <span className="font-medium">Type:</span>{" "}
          {incident.type || "N/A"}
        </p>
        <p>
          <span className="font-medium">Status:</span>{" "}
          {incident.status || "N/A"}
        </p>
        {typeof incident.amount === "number" && (
          <p>
            <span className="font-medium">Amount:</span> $
            {incident.amount.toFixed(2)}
          </p>
        )}
        {incident.createdAt && (
          <p>
            <span className="font-medium">Reported:</span> {incident.createdAt}
          </p>
        )}
      </div>

      {incident.description && (
        <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-700">
          {incident.description}
        </div>
      )}

      <p className="text-xs text-gray-500">
        If anything is wrong, you can open a dispute to provide your side of the
        story and upload supporting evidence.
      </p>

      <div className="flex justify-end pt-2">
        <Button variant="outline" onClick={close}>
          Close
        </Button>
      </div>
    </div>
  );
}