"use client";

export default function ClientExportsPage() {
  async function download(type: string) {
    const res = await fetch(`/api/client/exports?orgId=demo-org&type=${type}`);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}-export.csv`;
    a.click();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Exports</h1>
      <button
        onClick={() => download("renters")}
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
      >
        Download Renters CSV
      </button>
      <button
        onClick={() => download("incidents")}
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
      >
        Download Incidents CSV
      </button>
      <button
        onClick={() => download("disputes")}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Download Disputes CSV
      </button>
    </div>
  );
}
