'use client';

import { useState } from 'react';
import { UploadCloud, File, Trash2, Wand2 } from 'lucide-react';

// We will use the built-in File type for now.
export type EvidenceFile = File;

type Props = {
  files: EvidenceFile[];
  onFilesChange: (files: EvidenceFile[]) => void;
};

export default function EvidenceUploadSection({ files, onFilesChange }: Props) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    onFilesChange([...files, ...droppedFiles]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      onFilesChange([...files, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    onFilesChange(newFiles);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-md">Evidence Locker</h3>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-lg border-2 border-dashed bg-gray-50 p-6 text-center transition-all
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
      >
        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 font-semibold text-gray-700">
          Drag & drop files or click to upload
        </p>
        <p className="text-sm text-gray-500">
          Required: Rental Agreement. Recommended: Photos, receipts, communications.
        </p>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="absolute top-0 left-0 h-full w-full opacity-0 cursor-pointer"
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-3 pt-4">
          <h4 className="font-medium">Uploaded Files</h4>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg bg-white p-3 ring-1 ring-gray-200"
            >
              <div className="flex items-center gap-3">
                <File className="h-6 w-6 text-gray-500" />
                <div className="text-sm">
                  <p className="font-medium text-gray-800">{file.name}</p>
                  <p className="text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button onClick={() => removeFile(index)}>
                <Trash2 className="h-5 w-5 text-gray-400 hover:text-red-500" />
              </button>
            </div>
          ))}

          {/* AI Parsing Hooks UI */}
          <div className="space-y-3 rounded-lg bg-blue-50/50 p-4 border border-blue-200 mt-6">
             <h4 className="font-semibold text-blue-900 flex items-center gap-2">
                <Wand2 size={18}/>
                AI-Assisted Document Analysis
            </h4>
            <p className="text-sm text-blue-800/80">
                Our AI will pre-fill form fields by analyzing your documents. You will be asked to confirm all extracted information before submission.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-2 py-1 text-xs font-medium bg-white border border-gray-200 text-gray-600 rounded-full">Extract Dates</span>
                <span className="px-2 py-1 text-xs font-medium bg-white border border-gray-200 text-gray-600 rounded-full">Extract Amounts</span>
                <span className="px-2 py-1 text-xs font-medium bg-white border border-gray-200 text-gray-600 rounded-full">Extract Clauses</span>
                 <span className="px-2 py-1 text-xs font-medium bg-white border border-gray-200 text-gray-600 rounded-full">Detect Signatures</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
