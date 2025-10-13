"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { uploadEvidenceFiles } from "@/lib/storage";
import Select from "react-select";

const incidentTagOptions = [
  { value: "late_return", label: "Late Return" },
  { value: "damage", label: "Damage" },
  { value: "theft", label: "Theft" },
  { value: "unpaid_fees", label: "Unpaid Fees" },
  { value: "lease_violation", label: "Lease Violation" },
];

export default function AddIncidentPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [renterId, setRenterId] = useState("");
  const [type, setType] = useState("Late Rent");
  const [description, setDescription] = useState("");
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [notifyRenter, setNotifyRenter] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !renterId || !type || !description) {
      setError("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const evidenceUrls = await uploadEvidenceFiles(
        `incidents/${renterId}`,
        evidenceFiles,
      );
      const response = await fetch("/api/incidents/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          renterId,
          type,
          description,
          evidenceUrls,
          tags: tags.map((t) => t.value),
          notifyRenter,
          createdBy: user.uid,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create incident");
      }

      alert("Incident created successfully!");
      router.push("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Add New Incident</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 space-y-6"
      >
        <div>
          <label htmlFor="renterId">Renter User ID</label>
          <input
            id="renterId"
            type="text"
            value={renterId}
            onChange={(e) => setRenterId(e.target.value)}
            placeholder="Enter Renter's User ID"
            required
          />
          <p>
            For this demo, manually enter the user ID. In a real app, this would
            be a user search feature.
          </p>
        </div>

        <div>
          <label htmlFor="type">Incident Type</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option>Late Rent</option>
            <option>Property Damage</option>
            <option>Lease Violation</option>
            <option>Noise Complaint</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label>Incident Tags</label>
          <Select options={incidentTagOptions} isMulti onChange={setTags} />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Provide a detailed description..."
            required
          />
        </div>

        <div>
          <label>Upload Evidence (optional)</label>
          <input
            type="file"
            multiple
            onChange={(e) => setEvidenceFiles(Array.from(e.target.files ?? []))}
          />
        </div>

        <div className="flex items-center">
          <input
            id="notifyRenter"
            type="checkbox"
            checked={notifyRenter}
            onChange={(e) => setNotifyRenter(e.target.checked)}
          />
          <label htmlFor="notifyRenter" className="ml-2">
            Notify Renter via Email
          </label>
        </div>

        {error && <p>{error}</p>}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating Incident..." : "Create Incident"}
        </Button>
      </form>
    </div>
  );
}
