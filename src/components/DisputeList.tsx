"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";

import { db } from "@/firebase/client";

export default function DisputeList({ readOnly = false }) {
  const [disputes, setDisputes] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const snap = await getDocs(collection(db, "disputes"));
      const list: any[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      setDisputes(list);
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-3">
      {disputes.map((d) => (
        <div key={d.id} className="p-4 border rounded bg-white">
          <h2 className="font-bold">Dispute #{d.id}</h2>
          <p>Status: {d.status}</p>
          <p>Company: {d.companyId}</p>
          <p>Renter: {d.renterId}</p>
          {!readOnly && (
            <button className="mt-2 px-3 py-1 bg-blue-600 text-white rounded">
              Update Status
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
