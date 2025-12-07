"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export default function EvidenceUploader({
  label = "Upload Evidence",
  multiple = true,
}: {
  label?: string;
  multiple?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const handleFiles = (e: any) => {
    const selected = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selected]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">{label}</p>

      <div
        className="border border-dashed rounded-lg p-5 text-center bg-muted/50 cursor-pointer hover:bg-muted transition"
        onClick={() => inputRef.current?.click()}
      >
        <p className="text-muted-foreground text-sm">
          Click to upload or drag and drop files here.
        </p>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple={multiple}
          onChange={handleFiles}
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => (
            <div
              key={i}
              className="flex justify-between items-center border rounded-md p-2 bg-white shadow-sm"
            >
              <span className="text-sm">{file.name}</span>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => removeFile(i)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}