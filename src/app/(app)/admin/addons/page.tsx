"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import Protected from "@/components/protected";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ADDON_CATALOG } from "@/lib/addons";

type Org = {
  id: string;
  name: string;
  plan: string;
  addons: string[];
  reportCredits: number;
  updatedAt: number;
};

export default function SuperAdminAddons() {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    async function fetchOrgs() {
      setLoading(true);
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/admin/addons", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrgs(data.orgs);
      setLoading(false);
    }
    fetchOrgs();
  }, []);

  const filteredOrgs = filter
    ? orgs.filter((o) => o.addons.some(a => a.startsWith(filter)))
    : orgs;

  const exportCSV = () => {
    const csv = [
      ["Org ID", "Org Name", "Plan", "Add-Ons", "Report Credits", "Updated At"],
      ...filteredOrgs.map((o) => [
        o.id,
        o.name,
        o.plan,
        o.addons.join(", "),
        o.reportCredits.toString(),
        new Date(o.updatedAt).toISOString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "addons-overview.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };
  
  const uniqueAddonIds = [...new Set(ADDON_CATALOG.map(a => a.id))];

  return (
    <Protected roles={['super_admin']}>
      <div className="space-y-4">
        <h1 className="text-2xl font-headline">Add-Ons Overview</h1>
        <Card>
          <CardHeader>
            <CardTitle>Organizations & Add-Ons</CardTitle>
            <CardDescription>
              View all organizations, their active plans, and enabled add-ons.
            </CardDescription>
            <div className="flex items-center gap-4 pt-2">
                <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-full md:w-[280px]">
                        <SelectValue placeholder="Filter by Add-On" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All Add-Ons</SelectItem>
                        {uniqueAddonIds.map(id => (
                            <SelectItem key={id} value={id}>
                                {ADDON_CATALOG.find(a => a.id === id)?.name || id}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button onClick={exportCSV} variant="outline">Export CSV</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Active Add-Ons</TableHead>
                  <TableHead className="text-center">Credits</TableHead>
                  <TableHead>Last Update</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-12 mx-auto" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredOrgs.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell>
                        <div className="font-medium">{org.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">{org.id}</div>
                    </TableCell>
                    <TableCell className="capitalize">{org.plan}</TableCell>
                    <TableCell>
                      {org.addons.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {org.addons.map((a) => (
                            <Badge key={a} variant="secondary">
                              {ADDON_CATALOG.find(cat => a.startsWith(cat.id))?.name || a}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">None</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center font-medium">{org.reportCredits || 0}</TableCell>
                    <TableCell>{new Date(org.updatedAt).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {!loading && filteredOrgs.length === 0 && (
                <div className="text-center text-muted-foreground p-8">No organizations found for the selected filter.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </Protected>
  );
}
