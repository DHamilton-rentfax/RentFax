"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function FraudList({ readOnly = false }) {
  const [frauds, setFrauds] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const q = query(collection(db, "renters"), where("alert", "==", true));
      const snap = await getDocs(q);
      const list: any[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      setFrauds(list);
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-3">
      {frauds.map((f) => (
        <div key={f.id} className="p-4 border rounded bg-white">
          <h2 className="font-bold">Renter #{f.id}</h2>
          <p>Email: {f.email}</p>
          <p>Signals: {f.signals?.length || 0}</p>
          {!readOnly && (
            <button className="mt-2 px-3 py-1 bg-red-600 text-white rounded">
              Review Case
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
