'use client';

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/client";

export default function AdminPurchases() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const q = query(
        collection(db, "purchases"),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    })();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Purchases</h1>

      <div className="grid gap-3">
        {items.map(p => (
          <div key={p.id} className="border rounded-lg p-4 text-sm">
            <p><b>Type:</b> {p.type}</p>
            <p><b>Amount:</b> ${p.amount}</p>
            <p><b>Company:</b> {p.companyId}</p>
            <p><b>User:</b> {p.userId}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
