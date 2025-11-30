"use client";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { format } from "date-fns";

import { db } from "@/firebase/client";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AuditPanel({ targetPath }: { targetPath?: string }) {
  const { claims } = useAuth();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const companyId = claims?.companyId;

  useEffect(() => {
    if (!companyId) return;

    (async () => {
      setLoading(true);
      const base = collection(db, "auditLogs");
      const parts: any[] = [
        where("companyId", "==", companyId),
        orderBy("at", "desc"),
        limit(20),
      ];

      if (targetPath) {
        parts.unshift(where("targetPath", "==", targetPath));
      }

      const q = query(base, ...parts);
      const snap = await getDocs(q);
      setRows(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    })();
  }, [companyId, targetPath]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Trail</CardTitle>
        <CardDescription>
          {targetPath
            ? `Recent changes for ${targetPath}`
            : "Recent changes across the company"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Action</TableHead>
              {!targetPath && <TableHead>Target</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  {!targetPath && (
                    <TableCell>
                      <Skeleton className="h-5 w-28" />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={targetPath ? 3 : 4}
                  className="text-center text-muted-foreground"
                >
                  No audit history found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    {r.at?.toDate ? format(r.at.toDate(), "PP p") : ""}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {r.actorUid}
                  </TableCell>
                  <TableCell>
                    {r.action}{" "}
                    <span className="text-muted-foreground">
                      ({r.actorRole})
                    </span>
                  </TableCell>
                  {!targetPath && (
                    <TableCell className="font-mono text-xs truncate max-w-xs">
                      {r.targetPath}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
