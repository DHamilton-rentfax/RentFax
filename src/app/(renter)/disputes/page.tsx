"use client";
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/client";

export default function RenterDisputes() {
  const renterId = localStorage.getItem("renterId");
  const [disputes, setDisputes] = useState<any[]>([]);

  useEffect(() => {
    if (!renterId) return;
    const q = query(collection(db, "disputes"), where("renterId", "==", renterId));
    const unsub = onSnapshot(q, (snap) => {
      setDisputes(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [renterId]);

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white rounded-xl p-8 shadow">
      <h1 className="text-2xl font-bold mb-6">My Disputes</h1>
      {disputes.length === 0 ? (
        <p className="text-gray-500">No disputes yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {disputes.map((d) => (
            <li key={d.id} className="py-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">{d.renterStatement}</p>
                <p className="text-sm text-gray-500">
                  Updated: {new Date(d.updatedAt.seconds * 1000).toLocaleString()}
                </p>
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
