"use client";

import { useEffect, useState } from "react";
import DashboardSection from "./DashboardSection";
import Link from "next/link";
import { AlertTriangle, Clock } from "lucide-react";
import { db } from "@/firebase/client";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";

export default function RecentIncidents() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "incidents"),
      where("createdBy", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [user]);

  return (
    <DashboardSection title="Recent Incidents">
      {items.length === 0 ? (
        <p className="text-gray-500 text-sm">No incidents logged yet.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((i) => (
            <li
              key={i.id}
              className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50"
            >
              <div>
                <p className="font-medium text-[#1A2540]">
                  {i.type ?? "Incident"}
                </p>

                <p className="text-gray-500 text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(i.createdAt?.seconds * 1000).toLocaleString()}
                </p>
              </div>

              <Link
                href={`/incidents/${i.id}`}
                className="text-blue-600 text-sm hover:underline"
              >
                View
              </Link>
            </li>
          ))}
        </ul>
      )}
    </DashboardSection>
  );
}
