"use client";

import { useEffect, useState } from "react";

type Doc = { id: string; name: string; category: string; path: string };
type Renter = { id: string; firstName: string; lastName: string };

export default function DocsPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [renters, setRenters] = useState<Renter[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [selectedRenter, setSelectedRenter] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const orgId = "demo-org"; // TODO: replace with session org

  useEffect(() => {
    fetch(`/api/docs/list?orgId=${orgId}`).then(r => r.json()).then(setDocs);
    fetch(`/api/renters/list?orgId=${orgId}`).then(r => r.json()).then(setRenters);
  }, []);

  async function uploadDoc() {
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("orgId", orgId);
    formData.append("category", "Agreement");
    if (selectedRenter) {
      formData.append("renterId", selectedRenter);
    }

    await fetch("/api/docs/upload", { method: "POST", body: formData });
    const updated = await fetch(`/api/docs/list?orgId=${orgId}`).then(r => r.json());
    setDocs(updated);
    setFile(null);
    setSelectedRenter(null);
    setUploading(false);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Document Manager</h1>
      <div className="mb-4">
        <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="mb-2" />
        <select 
          value={selectedRenter || ""} 
          onChange={e => setSelectedRenter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">-- Select a Renter (Optional) --</option>
          {renters.map(r => (
            <option key={r.id} value={r.id}>{r.firstName} {r.lastName}</option>
          ))}
        </select>
        <button 
          onClick={uploadDoc} 
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
          disabled={!file || uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Uploaded Documents</h2>
        {docs.map(d => (
          <div key={d.id} className="border p-2 mb-2 rounded">
            <p><b>{d.name}</b> ({d.category})</p>
            <p className="text-sm text-gray-500">{d.path}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
