
"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface Incident {
  id: string;
  description: string;
  status: string;
  severity: number;
  createdAt: string;
}

export default function RenterDashboard() {
  const searchParams = useSearchParams();
  const renterId = searchParams.get("rid");
  const [renter, setRenter] = useState<any>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!renterId) return;
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/renters/${renterId}`);
        const data = await res.json();
        setRenter(data.renter);
        setIncidents(data.incidents);
      } catch (err) {
        console.error("Failed to load renter data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [renterId]);

  if (loading) return <div className="text-center mt-20">Loading your dashboard...</div>;

  if (!renter)
    return (
      <div className="text-center mt-20 text-red-500">
        Could not load renter data.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8 mb-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {renter.name}</h1>
            <p className="text-gray-500">Verified Email: {renter.email}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Your Risk Score</p>
            <p
              className={`text-3xl font-bold ${
                renter.score > 75
                  ? "text-green-600"
                  : renter.score > 50
                  ? "text-yellow-500"
                  : "text-red-600"
              }`}
            >
              {renter.score || 72}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Incidents */}
        <div className="md:col-span-2 bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Your Incidents</h2>

          {incidents.length === 0 ? (
            <p className="text-gray-500">No incidents linked to your account.</p>
          ) : (
            <ul className="space-y-4">
              {incidents.map((incident) => (
                <li
                  key={incident.id}
                  className="border rounded-lg p-4 hover:shadow transition"
                >
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-800">
                      {incident.description}
                    </p>
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        incident.status === "OPEN"
                          ? "bg-yellow-100 text-yellow-700"
                          : incident.status === "DISPUTED"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {incident.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">
                    Created: {new Date(incident.createdAt).toLocaleDateString()}
                  </p>
                  <button
                    className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                    onClick={() =>
                      (window.location.href = `/renter/disputes/new?incident=${incident.id}`)
                    }
                  >
                    View / Dispute
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right Column - Quick Actions */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <ul className="space-y-3">
            <li>
              <button
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => (window.location.href = "/renter/disputes")}
              >
                Manage Disputes
              </button>
            </li>
            <li>
              <button
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                onClick={() => (window.location.href = "/renter/documents")}
              >
                View Uploaded Documents
              </button>
            </li>
            <li>
              <button
                className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                onClick={() => (window.location.href = "/renter/payments")}
              >
                Make a Payment
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
