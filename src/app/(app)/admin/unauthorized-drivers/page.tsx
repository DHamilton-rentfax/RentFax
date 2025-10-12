"use client";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function AdminUnauthorizedDrivers() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/unauthorized-drivers");
    const data = await res.json();
    setReports(data.reports || []);
    setLoading(false);
  };

  useEffect(() => { fetchReports(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch("/api/admin/unauthorized-drivers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success(`Report ${status}`);
      fetchReports();
    } else toast.error("Error updating");
  };

  if (loading) return <div className="p-8">Loading reports...</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Unauthorized Driver Reports</h1>
      <div className="grid gap-4">
        {reports.map((r: any) => (
          <div key={r.id} className="border rounded p-4 bg-white shadow-sm">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">{r.driverName}</h2>
              <span className={`px-2 py-1 rounded text-sm ${r.status === "approved" ? "bg-green-100 text-green-800" : r.status === "rejected" ? "bg-red-100 text-red-800" : "bg-gray-100"}`}>{r.status}</span>
            </div>
            <p className="text-sm mt-1">{r.description}</p>
            {r.evidenceUrl && (
              <a href={r.evidenceUrl} target="_blank" className="text-blue-600 underline text-sm">View Evidence</a>
            )}
            <div className="mt-2 space-x-2">
              <button onClick={() => updateStatus(r.id, "approved")} className="bg-green-600 text-white px-3 py-1 rounded text-sm">Approve</button>
              <button onClick={() => updateStatus(r.id, "rejected")} className="bg-red-600 text-white px-3 py-1 rounded text-sm">Reject</button>
              <button onClick={() => updateStatus(r.id, "escalated")} className="bg-amber-500 text-white px-3 py-1 rounded text-sm">Escalate</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}