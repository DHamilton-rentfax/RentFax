
"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import Protected from "@/components/protected";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

type User = {
  uid: string;
  email: string;
  role: string;
  companyId?: string;
  lastLogin?: string;
};

export default function SuperAdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setUsers(data.users);
      } catch (e: any) {
        toast({ title: 'Error fetching users', description: e.message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [toast]);

  const filtered = query
    ? users.filter(
        (u) =>
          u.email?.toLowerCase().includes(query.toLowerCase()) ||
          u.uid.toLowerCase().includes(query.toLowerCase())
      )
    : users;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-headline">Users</h1>
      <Card>
        <CardHeader>
          <CardTitle>User Directory</CardTitle>
          <CardDescription>Search and manage all users on the platform.</CardDescription>
          <Input
            placeholder="Search by Email or User ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full md:w-[320px]"
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Organization ID</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : filtered.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell>
                    <div className="font-medium">{user.email}</div>
                    <div className="text-xs text-muted-foreground font-mono">{user.uid}</div>
                  </TableCell>
                  <TableCell className="capitalize">{user.role}</TableCell>
                  <TableCell className="font-mono text-xs">{user.companyId || 'N/A'}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">Manage</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!loading && filtered.length === 0 && (
            <div className="text-center text-muted-foreground p-8">No users found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
