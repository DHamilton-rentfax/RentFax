"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/client";
import { uploadEvidenceFiles } from "@/lib/storage";
import { Button } from "@/components/ui/button";

interface Incident {
  id: string;
  type: string;
  description: string;
  status: "pending" | "under_review" | "resolved" | "dismissed" | "Open"; // Expanded status
  evidence: string[];
  tags?: string[];
  createdAt: any;
}

export default function IncidentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [disputeMessage, setDisputeMessage] = useState("");
  const [disputeFiles, setDisputeFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user?.uid || !params.id) return;

    const fetchIncident = async () => {
      const incidentRef = doc(db, `renters/${user.uid}/incidents`, params.id);
      const incidentSnap = await getDoc(incidentRef);

      if (incidentSnap.exists()) {
        setIncident({
          id: incidentSnap.id,
          ...incidentSnap.data(),
        } as Incident);
      } else {
        console.error("No such incident!");
      }
      setLoading(false);
    };

    fetchIncident();
  }, [user?.uid, params.id]);

  const handleDisputeSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user?.uid || !incident) return;

    setSubmitting(true);
    try {
      const evidenceUrls = await uploadEvidenceFiles(
        incident.id,
        disputeFiles,
        user,
      );
      const newDisputeRef = await addDoc(
        collection(db, `renters/${user.uid}/disputes`),
        {
          id: incident.id,
          message: disputeMessage,
          evidence: evidenceUrls,
          submittedBy: user.uid,
          status: "under_review",
          createdAt: serverTimestamp(),
        },
      );

      const incidentRef = doc(db, `renters/${user.uid}/incidents`, incident.id);
      await updateDoc(incidentRef, { status: "under_review" });

      setIncident((prev) =>
        prev ? { ...prev, status: "under_review" } : null,
      );

      router.push(`/renter/disputes/${newDisputeRef.id}`);
    } catch (error) {
      console.error("Error submitting dispute:", error);
      alert("Failed to submit dispute. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!incident) return <div>Incident not found.</div>;

  const isDisputable =
    incident.status === "Open" || incident.status === "pending";

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Incident Details</h1>
      <div className="bg-white shadow-md rounded p-6 mb-6">
        <p>
          <strong>Type:</strong> {incident.type}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`font-semibold ${incident.status === "Open" || incident.status === "pending" ? "text-red-500" : "text-green-500"}`}
          >
            {incident.status}
          </span>
        </p>
        <p>
          <strong>Date Reported:</strong>{" "}
          {new Date(
            incident.createdAt?.toDate?.() ?? incident.createdAt,
          ).toLocaleDateString()}
        </p>
        <p>
          <strong>Description:</strong> {incident.description}
        </p>

        {incident.tags && incident.tags.length > 0 && (
          <div>
            <p className="font-semibold mt-4">Tags:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {incident.tags.map((tag) => (
                <span key={tag} className="badge">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {incident.evidence && incident.evidence.length > 0 && (
          <div>
            <p className="font-semibold mt-4">Evidence:</p>
            <ul>
              {incident.evidence.map((url, index) => (
                <li key={index}>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    View Evidence {index + 1}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {isDisputable && (
        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-2xl font-bold mb-4">Dispute This Incident</h2>
          <form onSubmit={handleDisputeSubmit} className="space-y-4">
            <textarea
              value={disputeMessage}
              onChange={(e) => setDisputeMessage(e.target.value)}
              placeholder="Explain why this report is incorrect..."
              required
            />
            <div>
              <label>Upload Evidence (optional)</label>
              <input
                type="file"
                multiple
                onChange={(e) =>
                  setDisputeFiles(Array.from(e.target.files ?? []))
                }
              />
            </div>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Dispute"}
            </Button>
          </form>
        </div>
      )}

      {!isDisputable && (
        <div role="alert">
          <p>
            This incident is currently <strong>{incident.status}</strong> and
            cannot be disputed at this time.
          </p>
        </div>
      )}
    </div>
  );
}
