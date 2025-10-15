"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import { User, ShieldCheck, Clock } from "lucide-react";

interface CurrentAssigneeCardProps {
  assignedTo?: string | null;
  assignedAt?: any; // Firestore timestamp
}

export default function CurrentAssigneeCard({
  assignedTo,
  assignedAt,
}: CurrentAssigneeCardProps) {
  const [assignee, setAssignee] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignee = async () => {
      if (!assignedTo) {
        setAssignee(null);
        setLoading(false);
        return;
      }

      try {
        const ref = doc(db, "users", assignedTo);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setAssignee({ id: snap.id, ...snap.data() });
        } else {
          setAssignee(null);
        }
      } catch (err) {
        console.error("Error fetching assignee:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignee();
  }, [assignedTo]);

  if (loading) {
    return (
      <div className="border rounded-lg p-4 bg-white shadow-sm flex items-center gap-3 text-gray-600 text-sm">
        <User className="h-4 w-4 animate-pulse text-gray-400" />
        Loading assignee...
      </div>
    );
  }

  if (!assignedTo || !assignee) {
    return (
      <div className="border rounded-lg p-4 bg-gray-50 flex items-center gap-3 text-gray-500 text-sm">
        <User className="h-4 w-4 text-gray-400" />
        <span>No team member currently assigned</span>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-5 bg-white shadow-sm mb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-emerald-100 text-emerald-700 w-10 h-10 rounded-full flex items-center justify-center font-semibold">
          {assignee.email?.charAt(0).toUpperCase() || "?"}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">
            {assignee.email || "Unknown User"}
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-gray-400" />
            {assignee.role || "Team Member"}
          </p>
        </div>
      </div>

      {assignedAt?.toDate ? (
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <Clock className="h-3 w-3 text-gray-400" />
          Assigned {assignedAt.toDate().toLocaleDateString()}
        </div>
      ) : null}
    </div>
  );
}
