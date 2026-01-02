"use client";

import { useEffect, useState } from "react";

async function logEvent(event: string, reportId: string) {
  const token = await window.firebase.auth().currentUser.getIdToken();
  await fetch("/api/analytics/log", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ event, reportId }),
  });
}

export default function ClientReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [entitled, setEntitled] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      const token = await window.firebase.auth().currentUser.getIdToken();
      const res = await fetch("/api/client/reports", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.error) {
        setEntitled(false);
      } else {
        setEntitled(true);
        setReports(data.reports || []);
        setPlan(data.plan || null);
      }
      setLoading(false);
    };
    fetchReports();
  }, []);

  if (loading) return <p className="p-6">Loading reports…</p>;

  if (!entitled) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h1 className="text-2xl font-bold mb-4">📑 Reports Not Included</h1>
        <p className="text-gray-600 mb-6">
          Monthly usage reports are available on the Enterprise plan or as an
          add-on for Pro and Unlimited.
        </p>
        <a
          href="/pricing"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Upgrade or Add Reporting
        </a>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📑 Monthly Reports</h1>
      {reports.length === 0 ? (
        <p>No reports generated yet. Check back next month.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((r) => (
            <div
              key={r.id}
              className="bg-white shadow rounded-lg p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold">
                  {new Date(r.period).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </h3>
                <p className="text-sm text-gray-600">
                  Reports Run: {r.usage.reportsRun}
                </p>
                <p className="text-sm text-gray-600">
                  Risk Flags: {r.usage.riskFlags}
                </p>
                <p className="text-sm text-gray-600">
                  Disputes: {r.usage.disputes}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Generated {new Date(r.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={async () => {
                    const token = await window.firebase
                      .auth()
                      .currentUser.getIdToken();
                    const res = await fetch(
                      `/api/client/reports/download?id=${r.id}`,
                      {
                        headers: { Authorization: `Bearer ${token}` },
                      },
                    );
                    const data = await res.json();
                    if (data.url) {
                      await logEvent("report_previewed", r.id);
                      setPreviewUrl(data.url); // open modal
                    } else {
                      alert("Preview error: " + data.error);
                    }
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Preview
                </button>

                <button
                  onClick={async () => {
                    const token = await window.firebase
                      .auth()
                      .currentUser.getIdToken();
                    const res = await fetch(
                      `/api/client/reports/download?id=${r.id}`,
                      {
                        headers: { Authorization: `Bearer ${token}` },
                      },
                    );
                    const data = await res.json();
                    if (data.url) {
                      await logEvent("report_downloaded", r.id);
                      window.open(data.url, "_blank");
                    } else {
                      alert("Download error: " + data.error);
                    }
                  }}
                  className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PDF Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 h-5/6 relative">
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <iframe
              src={previewUrl}
              className="w-full h-full rounded-b-lg"
              title="Report Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
}
