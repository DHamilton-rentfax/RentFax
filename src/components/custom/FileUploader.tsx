"use client";

import { useState } from "react";

import HIPAASafeUploadZone from "@/components/ui/HIPAASafeUploadZone";

interface FileUploaderProps {
  onUploadComplete: (urls: string[]) => void;
}

export function FileUploader({ onUploadComplete }: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (file: File | null) => {
    if (file) {
      setIsUploading(true);
      // Simulate file upload
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const uploadedUrl = URL.createObjectURL(file);
      onUploadComplete([uploadedUrl]);
      setIsUploading(false);
    }
  };

  return (
    <div>
      <HIPAASafeUploadZone onFileSelect={handleFileSelect} />
      {isUploading && <p>Uploading...</p>}
    </div>
  );
}
