"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, UploadCloud } from "lucide-react";

interface RenterUploadEvidenceModalProps {
  disputeId: string;
  close: () => void;
}

export default function RenterUploadEvidenceModal({
  disputeId,
  close,
}: RenterUploadEvidenceModalProps) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      setError("Please choose at least one file to upload.");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("disputeId", disputeId);
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });

      const res = await fetch("/api/renter/disputes/upload-evidence", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to upload evidence");
      }

      close();
    } catch (err: any) {
      console.error("Upload evidence error", err);
      setError(err.message || "Could not upload evidence.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <UploadCloud className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Upload Evidence</h2>
      </div>

      <p className="text-sm text-gray-600">
        Add documents, screenshots, or receipts that support your dispute. Do
        not upload medical records or any protected health information.
      </p>

      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
      />

      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="flex gap-2 pt-2">
        <Button
          className="flex-1"
          onClick={handleUpload}
          disabled={uploading || !files || files.length === 0}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Upload Files"
          )}
        </Button>
        <Button variant="outline" className="flex-1" onClick={close}>
          Cancel
        </Button>
      </div>
    </div>
  );
}