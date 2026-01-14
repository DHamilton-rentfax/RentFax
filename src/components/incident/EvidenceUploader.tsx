"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export interface EvidenceUploaderProps {
  label?: string;
  multiple?: boolean;
  accept?: string;
  maxFiles?: number;
  onFilesChange?: (files: File[]) => void;
}

export default function EvidenceUploader({
  label = "Upload Evidence",
  multiple = true,
  accept = "image/*,application/pdf,video/*",
  maxFiles = 10,
  onFilesChange,
}: EvidenceUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  // Emit files upward (business logic lives in the page)
  useEffect(() => {
    onFilesChange?.(files);
  }, [files, onFilesChange]);

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    const selected = Array.from(e.target.files);

    setFiles((prev) => {
      const merged = [...prev, ...selected];
      return merged.slice(0, maxFiles);
    });

    // Allow selecting the same file again
    e.target.value = "";
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function openFileDialog() {
    inputRef.current?.click();
  }

  return (
    <div className="space-y-3">
      {/* Label */}
      <div className="text-sm font-medium">{label}</div>

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        hidden
        multiple={multiple}
        accept={accept}
        onChange={handleSelect}
      />

      {/* Upload trigger */}
      <button
        type="button"
        onClick={openFileDialog}
        className="w-full border border-dashed rounded-lg p-6 text-sm text-muted-foreground bg-muted/50 hover:bg-muted transition focus:outline-none focus:ring-2 focus:ring-primary"
      >
        Click to upload files
        <br />
        <span className="text-xs opacity-70">
          Images, PDFs, or videos (max {maxFiles})
        </span>
      </button>

      {/* File list */}
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between gap-2 border rounded-md px-3 py-2 bg-white shadow-sm"
            >
              <div className="min-w-0">
                <p className="text-sm truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                className="h-8 w-8 p-0"
                aria-label="Remove file"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
