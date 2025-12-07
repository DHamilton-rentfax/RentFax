"use client";

import { useEffect, useState } from "react";
import DashboardSection from "./DashboardSection";
import Link from "next/link";
import { Users, Clock } from "lucide-react";
import { db } from "@/firebase/client";
import {
  collection,
  query,
  orderBy,
  where,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";

export default function RecentRenters() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "renterProfiles"),
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
    <DashboardSection title="Recent Renters Added">
      {items.length === 0 ? (
        <p className="text-gray-500 text-sm">No renters added yet.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((r) => (
            <li
              key={r.id}
              className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50"
            >
              <div>
                <p className="font-medium text-[#1A2540]">
                  {r.name ?? "Unnamed Renter"}
                </p>

                <p className="text-gray-500 text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(r.createdAt?.seconds * 1000).toLocaleString()}
                </p>
              </div>

              <Link
                href={`/renters/${r.id}`}
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
