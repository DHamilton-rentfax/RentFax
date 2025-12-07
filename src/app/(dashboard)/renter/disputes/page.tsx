"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/firebase/client";

import { useAuth } from "@/hooks/use-auth";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

interface DisputeRecord extends DocumentData {
  id: string;
  incidentId?: string;
  renterId?: string;
  renterName?: string;
  companyName?: string;
  amount?: number;
  status?: string;
  createdAt?: { seconds: number };
}

export default function RenterDisputesPage() {
  const { user, loading: authLoading } = useAuth();
  const [disputes, setDisputes] = useState<DisputeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);

      // If renterProfileId is different from auth UID, change field/logic here:
      const snap = await getDocs(
        query(
          collection(db, "disputes"),
          where("renterId", "==", user.uid),
          orderBy("createdAt", "desc")
        )
      );

      setDisputes(
        snap.docs.map((d) => ({ id: d.id, ...d.data() } as DisputeRecord))
      );
      setLoading(false);
    };

    load();
  }, [authLoading, user]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 text-gray-600">
        Please sign in to view your disputes.
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <Card className="p-6">
        <h1 className="text-2xl font-bold text-[#1A2540]">
          My Disputes
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          These are disputes you’ve submitted about incidents on your
          RentFAX record.
        </p>
      </Card>

      <Card className="p-4">
        {disputes.length === 0 ? (
          <p className="text-gray-500 text-sm">
            You haven&apos;t submitted any disputes yet.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Incident</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disputes.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.incidentId ?? "—"}</TableCell>
                  <TableCell>{d.companyName ?? "—"}</TableCell>
                  <TableCell>
                    {d.amount ? `$${d.amount}` : "—"}
                  </TableCell>
                  <TableCell className="capitalize">
                    <span
                      className={`font-semibold ${
                        d.status === "resolved"
                          ? "text-green-600"
                          : d.status === "pending"
                          ? "text-yellow-600"
                          : d.status === "review"
                          ? "text-blue-600"
                          : "text-red-600"
                      }`}
                    >
                      {d.status ?? "unknown"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {d.createdAt?.seconds
                      ? new Date(
                          d.createdAt.seconds * 1000
                        ).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/renter/disputes/${d.id}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View →
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}