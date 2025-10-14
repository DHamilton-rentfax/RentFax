"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/client";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { Loader2, MessageSquare, User, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ActivityLogProps {
  disputeId: string;
}

export function ActivityLog({ disputeId }: ActivityLogProps) {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!disputeId) return;

    const q = query(
      collection(db, "activity_logs"),
      where("disputeId", "==", disputeId),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setActivities(data);
      setLoading(false);
    });

    return () => unsub();
  }, [disputeId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-24">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-3">Activity History</h3>
      {activities.length === 0 ? (
        <p className="text-sm text-gray-500">No activity recorded yet.</p>
      ) : (
        <ul className="space-y-6">
          {activities.map((act) => (
            <li key={act.id} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm">
                    {act.role || "User"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {act.createdAt?.toDate().toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-1">
                  Status set to <Badge variant="outline">{act.status}</Badge>
                </p>
                {act.note && (
                  <div className="mt-2 text-sm bg-gray-50 p-2 rounded-md border">
                    <p className="italic">"{act.note}"</p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
