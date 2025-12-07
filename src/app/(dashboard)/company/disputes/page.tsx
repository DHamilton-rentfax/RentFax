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
  renterName?: string;
  incidentId?: string;
  amount?: number;
  status?: string;
  createdAt?: { seconds: number };
}

export default function CompanyDisputesPage() {
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

      // If you use filedByCompanyId instead, change the field name here.
      const snap = await getDocs(
        query(
          collection(db, "disputes"),
          where("filedByUserId", "==", user.uid),
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
        Please sign in to view company disputes.
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <Card className="p-6">
        <h1 className="text-2xl font-bold text-[#1A2540]">
          Company Disputes
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Disputes you or your team have filed related to your incidents.
        </p>
      </Card>

      <Card className="p-4">
        {disputes.length === 0 ? (
          <p className="text-gray-500 text-sm">
            Your company has not filed any disputes yet.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Renter</TableHead>
                <TableHead>Incident</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disputes.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.renterName ?? "Unknown"}</TableCell>
                  <TableCell>{d.incidentId ?? "—"}</TableCell>
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
                      href={`/disputes/${d.id}`}
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
