"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timestamp } from "firebase/firestore";
import { FileUploader } from "@/components/custom/FileUploader";
import { Incident } from "@/types/incident";

interface DisputePanelProps {
  incident: Incident;
}

export default function DisputePanel({
  incident: initialIncident,
}: DisputePanelProps) {
  const [incident, setIncident] = useState(initialIncident);
  const [disputeMessage, setDisputeMessage] = useState("");
  const [disputeFiles, setDisputeFiles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDisputeSubmit = async () => {
    setIsSubmitting(true);
    const res = await fetch("/api/incidents/dispute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        incidentId: incident.id,
        message: disputeMessage,
        files: disputeFiles,
      }),
    });

    if (res.ok) {
      alert("Dispute submitted successfully!");
      setIncident({ ...incident, status: "disputed" });
      setDisputeMessage("");
      setDisputeFiles([]);
    } else {
      alert("Error submitting dispute");
    }

    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incident Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <strong>Description:</strong>
          <p>{incident.description}</p>
        </div>
        <div>
          <strong>Amount Owed:</strong>
          <p>${incident.amount.toFixed(2)}</p>
        </div>
        <div>
          <strong>Status:</strong>
          <p>{incident.status}</p>
        </div>
        {incident.evidence && incident.evidence.length > 0 && (
          <div>
            <strong>Evidence:</strong>
            <ul className="list-disc pl-5">
              {incident.evidence.map((file, index) => (
                <li key={index}>
                  <a
                    href={file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Evidence {index + 1}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {incident.status !== "disputed" && (
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold">Submit a Dispute</h3>
            <div className="space-y-2 mt-2">
              <Textarea
                placeholder="Explain why you are disputing this incident..."
                value={disputeMessage}
                onChange={(e) => setDisputeMessage(e.target.value)}
              />
              <FileUploader onUploadComplete={setDisputeFiles} />
              <Button
                onClick={handleDisputeSubmit}
                disabled={isSubmitting || !disputeMessage}
              >
                {isSubmitting ? "Submitting..." : "Submit Dispute"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
