"use client";
import { useEffect, useState } from "react";

export default function RenterDisputes() {
  const renterId = localStorage.getItem("renterId");
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!renterId) return;
    const fetchDisputes = async () => {
      const res = await fetch(`/api/disputes/${renterId}`);
      const data = await res.json();
      setDisputes(data.disputes || []);
      setLoading(false);
    };
    fetchDisputes();
  }, [renterId]);

  if (loading) return <p className="text-center mt-20">Loading disputes...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6">My Disputes</h1>

      {disputes.length === 0 ? (
        <p className="text-gray-500">You haven’t submitted any disputes yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {disputes.map((d) => (
            <li key={d.id} className="py-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">
                    Incident ID: {d.incidentId}
                  </p>
                  <p className="text-sm text-gray-600">{d.renterStatement}</p>
                </div>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    d.status === "SUBMITTED"
                      ? "bg-blue-100 text-blue-700"
                      : d.status === "UNDER_REVIEW"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {d.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
