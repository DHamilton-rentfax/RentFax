"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/client";
import Protected from "@/components/protected";
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
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Download } from "lucide-react";

const STATUSES = ["new", "reviewed", "interviewing", "rejected", "hired"];

export default function ApplicationsAdminPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "applications"),
      orderBy("createdAt", "desc"),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setApplications(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    const appRef = doc(db, "applications", id);
    await updateDoc(appRef, { status });
  };

  return (
    <Protected roles={["owner", "manager"]}>
      <div className="space-y-4">
        <h1 className="text-2xl font-headline">Job Applications</h1>
        <Card>
          <CardHeader>
            <CardTitle>Candidate Pipeline</CardTitle>
            <CardDescription>
              Review and manage all job applications submitted for your company.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Resume</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-5 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-28" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-8" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-24" />
                        </TableCell>
                      </TableRow>
                    ))
                  : applications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>
                          {format(new Date(app.createdAt), "PP")}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{app.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {app.email}
                          </div>
                        </TableCell>
                        <TableCell>{app.role}</TableCell>
                        <TableCell>
                          <Button asChild variant="ghost" size="icon">
                            <Link href={app.resumeUrl} target="_blank" download>
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download Resume</span>
                            </Link>
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Select
                            defaultValue={app.status}
                            onValueChange={(value) =>
                              handleStatusChange(app.id, value)
                            }
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue placeholder="Set status" />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUSES.map((s) => (
                                <SelectItem
                                  key={s}
                                  value={s}
                                  className="capitalize"
                                >
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
            {!loading && applications.length === 0 && (
              <div className="text-center p-8 text-muted-foreground">
                No applications submitted yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Protected>
  );
}
