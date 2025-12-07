"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  collection,
  getDocs,
  orderBy,
  query,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/firebase/client";

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

interface IncidentRecord extends DocumentData {
  id: string;
  description?: string;
  renterId?: string;
  renterName?: string;
  status?: string;
  riskScore?: number;
  createdAt?: { seconds: number };
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const snap = await getDocs(
        query(collection(db, "incidents"), orderBy("createdAt", "desc"))
      );

      setIncidents(
        snap.docs.map(
          (d) => ({ id: d.id, ...d.data() } as IncidentRecord)
        )
      );

      setLoading(false);
    };

    load();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="space-y-6 pb-10">
      <Card className="p-4">
        <h1 className="text-2xl font-bold text-[#1A2540]">Incidents</h1>
        <p className="text-gray-600 text-sm mt-1">
          All renter-related reports submitted by companies or landlords.
        </p>
      </Card>

      <Card className="p-4">
        {incidents.length === 0 ? (
          <p className="text-gray-500 text-sm">No incidents found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Renter</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {incidents.map((inc) => (
                <TableRow key={inc.id}>
                  <TableCell>
                    <Link
                      href={`/incidents/${inc.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {inc.description?.slice(0, 60) ?? "Incident"}
                    </Link>
                  </TableCell>

                  <TableCell>
                    {inc.renterName ? (
                      <Link
                        href={`/renters/${inc.renterId}`}
                        className="text-blue-600 hover:underline"
                      >
                        {inc.renterName}
                      </Link>
                    ) : (
                      "Unknown"
                    )}
                  </TableCell>

                  <TableCell className="capitalize">
                    <span
                      className={`font-medium ${
                        inc.status === "open"
                          ? "text-yellow-600"
                          : inc.status === "resolved"
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      {inc.status ?? "unknown"}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span
                      className={`font-semibold ${
                        (inc.riskScore ?? 0) > 75
                          ? "text-red-600"
                          : (inc.riskScore ?? 0) > 40
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {inc.riskScore ?? "N/A"}
                    </span>
                  </TableCell>

                  <TableCell>
                    {inc.createdAt?.seconds
                      ? new Date(
                          inc.createdAt.seconds * 1000
                        ).toLocaleDateString()
                      : "—"}
                  </TableCell>

                  <TableCell>
                    <Link
                      href={`/incidents/${inc.id}`}
                      className="text-blue-600 hover:underline"
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
