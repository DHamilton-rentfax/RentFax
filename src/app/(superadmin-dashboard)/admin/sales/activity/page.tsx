"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { ActivityTimeline } from "@/components/sales/ActivityTimeline";

export default function ActivityPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, "activities"), orderBy("timestamp", "desc"), limit(50));
    return onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Activity</h1>
      <ActivityTimeline items={items} />
    </div>
  );
}
