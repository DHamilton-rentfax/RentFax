"use client";

import { Upload, Paperclip } from "lucide-react";

interface Props {
  label: string;
  hint?: string;
  multiple?: boolean;
}

export default function SectionUploadArea({
  label,
  hint,
  multiple = true,
}: Props) {
  return (
    <div className="mt-4 border rounded-md p-3 bg-gray-50">
      <div className="flex items-center gap-2 mb-2">
        <Paperclip className="h-4 w-4 text-gray-500" />
        <p className="text-sm font-medium">{label}</p>
      </div>

      {hint && (
        <p className="text-xs text-gray-500 mb-2">{hint}</p>
      )}

      <label className="flex items-center justify-center gap-2 border border-dashed rounded-md py-6 cursor-pointer hover:bg-gray-100">
        <Upload className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-600">
          Click to upload {multiple ? "files" : "a file"}
        </span>
        <input
          type="file"
          multiple={multiple}
          className="hidden"
        />
      </label>
    </div>
  );
}
