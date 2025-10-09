
"use client";
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/client";

export default function RenterDisputes() {
  const renterId = localStorage.getItem("renterId");
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!renterId) {
      setLoading(false);
      return;
    }
    const q = query(collection(db, "disputes"), where("renterId", "==", renterId));
    const unsub = onSnapshot(q, (snap) => {
      setDisputes(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
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
                  <p className="font-semibold text-gray-800">
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
                <div className="mt-3 bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700">
                    <b>AI Summary:</b> {d.aiSummary || "Pending analysis by RentFAX AI engine."}
                  </p>
                </div>
               <button
                  onClick={() => window.open(`/api/disputes/${d.id}/report`, "_blank")}
                  className="text-blue-600 hover:underline text-sm mt-3"
                >
                  Download Report (PDF)
                </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
