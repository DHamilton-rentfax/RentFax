"use client";

import { useEffect, useState } from "react";
import DashboardSection from "./DashboardSection";
import Link from "next/link";
import { Clock, Search } from "lucide-react";
import { db } from "@/firebase/client";
import {
  collection,
  query,
  orderBy,
  limit,
  where,
  onSnapshot,
} from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";

export default function RecentSearches() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "searchLogs"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [user]);

  return (
    <DashboardSection title="Recent Searches">
      {items.length === 0 ? (
        <p className="text-gray-500 text-sm">No recent searches found.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((s) => (
            <li
              key={s.id}
              className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50"
            >
              <div>
                <p className="font-medium text-[#1A2540]">{s.query}</p>
                <p className="text-gray-500 text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(s.createdAt?.seconds * 1000).toLocaleString()}
                </p>
              </div>
              <Link
                href={`/report/${s.targetId}`}
                className="text-blue-600 text-sm hover:underline flex items-center gap-1"
              >
                <Search className="w-4 h-4" />
                View Report
              </Link>
            </li>
          ))}
        </ul>
      )}
    </DashboardSection>
  );
}
