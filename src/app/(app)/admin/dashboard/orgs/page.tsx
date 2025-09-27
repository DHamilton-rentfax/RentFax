
"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import Protected from "@/components/protected";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

type Org = {
  id: string;
  name: string;
  plan: string;
  addons: string[];
  reportCredits: number;
  updatedAt: number;
};

export default function SuperAdminOrgs() {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    async function fetchOrgs() {
      setLoading(true);
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch("/api/admin/orgs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setOrgs(data.orgs);
      } catch (e: any) {
        toast({ title: 'Error fetching organizations', description: e.message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    }
    fetchOrgs();
  }, [toast]);

  const filteredOrgs = query
    ? orgs.filter(
        (o) =>
          o.name?.toLowerCase().includes(query.toLowerCase()) ||
          o.id.toLowerCase().includes(query.toLowerCase())
      )
    : orgs;

  return (
    <Protected roles={['super_admin']}>
      <div className="space-y-4">
        <h1 className="text-2xl font-headline">Organizations</h1>
        <Card>
          <CardHeader>
            <CardTitle>Company Directory</CardTitle>
            <CardDescription>
              Search and manage all organizations on the platform.
            </CardDescription>
            <div className="flex items-center gap-4 pt-2">
              <Input
                placeholder="Search by Org Name or ID..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full md:w-[320px]"
              />
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
                  <TableHead>Actions</TableHead>
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
                      <TableCell><Skeleton className="h-8 w-24" /></TableCell>
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
                      {org.addons?.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {org.addons.map((a) => (
                            <Badge key={a} variant="secondary" className="text-xs">
                              {a.replace(/^addon_/, '').replace(/_monthly$/, '').replace(/_/g, ' ')}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">None</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center font-medium">{org.reportCredits || 0}</TableCell>
                    <TableCell>
                       <Button variant="outline" size="sm">Manage</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {!loading && filteredOrgs.length === 0 && (
              <div className="text-center text-muted-foreground p-8">No organizations found.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </Protected>
  );
}
