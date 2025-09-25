"use client";

import { useEffect, useState } from "react";

type Doc = { id: string; name: string; category: string };

export default function RenterDocsPage({ searchParams }: { searchParams: { token: string } }) {
  const { token } = searchParams;
  const [docs, setDocs] = useState<Doc[]>([]);

  useEffect(() => {
    fetch(`/api/renter/docs?token=${token}`).then(r => r.json()).then(setDocs);
  }, [token]);

  async function viewDoc(docId: string) {
    const res = await fetch(`/api/renter/docs/${docId}/download?token=${token}`);
    const data = await res.json();
    if (data.url) window.open(data.url, "_blank");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Shared Documents</h1>
      <div className="space-y-3">
        {docs.map(d => (
          <div key={d.id} className="border p-3 rounded bg-white flex justify-between">
            <div>
              <p><b>{d.name}</b> ({d.category})</p>
            </div>
            <button
              onClick={() => viewDoc(d.id)}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
