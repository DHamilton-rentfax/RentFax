"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
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

import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface RenterRecord extends DocumentData {
  id: string;
  name?: string;
  email?: string;
  emails?: string[];
  status?: string;
  alert?: boolean;
  riskScore?: number;
  createdAt?: { seconds: number };
}

export default function RentersPage() {
  const [renters, setRenters] = useState<RenterRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const rentersSnap = await getDocs(
        query(collection(db, "renterProfiles"), orderBy("createdAt", "desc"))
      );

      const list = rentersSnap.docs.map(
        (d) => ({ id: d.id, ...d.data() } as RenterRecord)
      );

      setRenters(list);
      setLoading(false);
    };

    load();
  }, []);

  const filtered = renters.filter((r) => {
    const s = search.toLowerCase();
    return (
      r.name?.toLowerCase().includes(s) ||
      r.email?.toLowerCase().includes(s) ||
      r.emails?.some((e) => e.toLowerCase().includes(s))
    );
  });

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h1 className="text-2xl font-bold text-[#1A2540]">Renters</h1>
        <p className="text-gray-600 text-sm mt-1">
          Manage renter profiles, disputes, risk scores, and verification.
        </p>

        <Input
          placeholder="Search renters by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-4 max-w-md"
        />
      </Card>

      <Card className="p-4">
        {filtered.length === 0 ? (
          <p className="text-gray-500 text-sm">No renters found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <Link
                      href={`/dashboard/renters/${r.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {r.name ?? "Unnamed"}
                    </Link>
                  </TableCell>

                  <TableCell>{r.emails?.[0] ?? r.email ?? "—"}</TableCell>

                  <TableCell>
                    <span
                      className={`capitalize ${
                        r.alert || r.status === "flagged"
                          ? "text-red-600"
                          : r.status === "verified"
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      {r.status ?? (r.alert ? "Flagged" : "Unknown")}
                    </span>
                  </TableCell>

                  <TableCell>
                    {r.riskScore ? `${r.riskScore}/100` : "N/A"}
                  </TableCell>

                  <TableCell>
                    <Link
                      href={`/dashboard/renters/${r.id}`}
                      className="text-sm text-blue-600 hover:underline"
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
