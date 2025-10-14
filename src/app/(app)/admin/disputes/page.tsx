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
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Filter } from "lucide-react";

export default function DisputeDashboardPage() {
  const { user, role, businessId } = useAuth();
  const router = useRouter();
  const [disputes, setDisputes] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !businessId) return;
    let q;

    if (role === "RENTER") {
      q = query(
        collection(db, "disputes"),
        where("renterId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
    } else {
      q = query(
        collection(db, "disputes"),
        where("businessId", "==", businessId),
        orderBy("createdAt", "desc")
      );
    }

    const unsub = onSnapshot(q, (snapshot) => {
      let data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      if (statusFilter !== "all") {
        data = data.filter((d) => d.status === statusFilter);
      }
      setDisputes(data);
      setLoading(false);
    });

    return () => unsub();
  }, [user, businessId, role, statusFilter]);

  const statusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "under_review":
        return "bg-blue-100 text-blue-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-600">
        <Loader2 className="animate-spin mr-2" /> Loading disputes...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Dispute Dashboard</h1>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-600" />
          <select
            className="border rounded-md px-2 py-1 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {disputes.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No disputes found for this filter.
        </p>
      ) : (
        <div className="border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="p-3">Description</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Created</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {disputes.map((d) => (
                <tr
                  key={d.id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3">{d.description || "—"}</td>
                  <td className="p-3">${d.amount?.toFixed(2) || "0.00"}</td>
                  <td className="p-3">
                    <Badge className={statusColor(d.status)}>
                      {d.status || "pending"}
                    </Badge>
                  </td>
                  <td className="p-3">
                    {d.createdAt?.toDate
                      ? d.createdAt.toDate().toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="p-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        router.push(`/admin/disputes/${d.id}`)
                      }
                    >
                      View / Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
