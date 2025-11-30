'use client';

import { useState } from "react";
import { Timestamp } from "firebase/firestore";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HIPAASafeUploadZone from "@/components/ui/HIPAASafeUploadZone";
import { Incident } from "@/types/incident";
import { useToast } from "@/hooks/use-toast";

interface DisputePanelProps {
  incident: Incident;
}

const forbiddenKeywords = ["diagnosis", "medical", "hospital", "therapy", "medication", "doctor"];

function validateTextInput(text: string): boolean {
  return !forbiddenKeywords.some((word) =>
    text.toLowerCase().includes(word.toLowerCase())
  );
}

export default function DisputePanel({
  incident: initialIncident,
}: DisputePanelProps) {
  const { toast } = useToast();
  const [incident, setIncident] = useState(initialIncident);
  const [disputeMessage, setDisputeMessage] = useState("");
  const [disputeFile, setDisputeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDisputeSubmit = async () => {
    if (!validateTextInput(disputeMessage)) {
      toast({
        title: "Submission Rejected",
        description: "Your dispute contains potential medical information. Please remove it before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    // In a real app, you would upload the file here.
    console.log("File to upload:", disputeFile);

    const res = await fetch("/api/incidents/dispute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        incidentId: incident.id,
        message: disputeMessage,
        // Pass the file URL if the upload was successful
        files: disputeFile ? [disputeFile.name] : [],
      }),
    });

    if (res.ok) {
      alert("Dispute submitted successfully!");
      setIncident({ ...incident, status: "disputed" });
      setDisputeMessage("");
      setDisputeFile(null);
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
              <HIPAASafeUploadZone onFileSelect={setDisputeFile} />
              
              <div className="mt-6 bg-red-50 border border-red-300 p-3 rounded-xl text-sm text-red-800 flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-600" />
                <span>
                  <strong>Reminder:</strong> Do not include any medical or health-related
                  information in your incident description or uploads. Such submissions are
                  strictly prohibited under our Privacy Policy and Terms of Use.
                </span>
              </div>

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
