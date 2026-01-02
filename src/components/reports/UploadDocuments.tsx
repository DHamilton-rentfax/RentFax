"use client";

export default function UploadDocuments({ onUpload }: any) {
  return (
    <div className="border p-4 rounded space-y-2">
      <h3 className="font-semibold">Upload Rental Documents</h3>
      <p className="text-sm text-gray-600">
        We can automatically extract payment schedules and history. You will
        review everything before finalizing.
      </p>

      <input
        type="file"
        accept=".pdf,.csv"
        onChange={(e) => onUpload(e.target.files?.[0])}
      />
    </div>
  );
}