"use client";

export default function EvidenceUpload({
  onUpload,
}: {
  onUpload: (refs: string[]) => void;
}) {
  async function handleFiles(e: any) {
    const files = Array.from(e.target.files);
    const refs = files.map((f) => `mock://${f.name}`);
    onUpload(refs);
  }

  return (
    <div className="border rounded p-4">
      <label className="block text-sm font-medium mb-1">
        Upload Evidence (images, PDFs)
      </label>
      <input type="file" multiple onChange={handleFiles} />
    </div>
  );
}
