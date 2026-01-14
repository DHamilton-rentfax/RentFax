'use client';

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/firebase/client";

export default function AdminAccessLogs() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const q = query(
        collection(db, "accessLogs"),
        orderBy("createdAt", "desc"),
        limit(100)
      );
      const snap = await getDocs(q);
      setLogs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    })();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Access Logs</h1>

      <div className="border rounded-lg overflow-hidden">
        {logs.map(log => (
          <div key={log.id} className="border-b p-3 text-sm">
            <p><b>Type:</b> {log.type}</p>
            <p><b>Company:</b> {log.companyId}</p>
            <p><b>User:</b> {log.userId}</p>
            <p><b>Time:</b> {new Date(log.createdAt?.seconds * 1000).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
