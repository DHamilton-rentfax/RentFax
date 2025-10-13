"use client";

import { useState } from "react";

interface FileUploaderProps {
  onUploadComplete: (urls: string[]) => void;
}

export function FileUploader({ onUploadComplete }: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIsUploading(true);
      // Simulate file upload
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const uploadedUrls = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file),
      );
      onUploadComplete(uploadedUrls);
      setIsUploading(false);
    }
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileChange} />
      {isUploading && <p>Uploading...</p>}
    </div>
  );
}
