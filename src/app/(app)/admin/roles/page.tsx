
"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import Protected from "@/components/protected";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type User = {
    uid: string;
    email: string;
    role: string;
}

export default function RoleManagerPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingUid, setUpdatingUid] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch users.');
        const data = await res.json();
        setUsers(data.users || []);
      } catch (e: any) {
        toast({ title: 'Error', description: e.message, variant: 'destructive'});
      }
      setLoading(false);
    }
    fetchUsers();
  }, [toast]);

  async function updateRole(uid: string, role: string) {
    setUpdatingUid(uid);
    try {
        const token = await auth.currentUser?.getIdToken(true); // Force refresh
        await fetch("/api/admin/roles", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ uid, role }),
        });
        
        setUsers(users.map(u => u.uid === uid ? { ...u, role } : u));
        toast({ title: 'Role Updated', description: `User ${uid} is now a ${role}.`})
    } catch (e: any) {
        toast({ title: 'Error', description: e.message, variant: 'destructive'});
    }
    setUpdatingUid(null);
  }

  return (
    <Protected roles={['super_admin']}>
        <div className="space-y-4">
            <h1 className="text-2xl font-headline">Role Manager</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Manage User Roles</CardTitle>
                    <CardDescription>
                        Promote or demote users to <strong>user</strong>, <strong>admin</strong>, or <strong>super_admin</strong>. Changes take effect immediately.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {loading ? (
                             Array.from({length: 3}).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-48" /></TableCell>
                                </TableRow>
                            ))
                        ): users.map((u) => (
                            <TableRow key={u.uid}>
                                <TableCell>
                                    <div className="font-medium">{u.email}</div>
                                    <div className="text-xs text-muted-foreground font-mono">{u.uid}</div>
                                </TableCell>
                                <TableCell className="font-semibold capitalize">{u.role}</TableCell>
                                <TableCell className="flex gap-2">
                                    <Button
                                        onClick={() => updateRole(u.uid, "user")}
                                        disabled={!!updatingUid}
                                        variant={u.role === 'user' ? 'default' : 'outline'}
                                        size="sm"
                                    >
                                        {updatingUid === u.uid && <Loader2 className="animate-spin" />} User
                                    </Button>
                                    <Button
                                        onClick={() => updateRole(u.uid, "admin")}
                                        disabled={!!updatingUid}
                                         variant={u.role === 'admin' ? 'default' : 'outline'}
                                        size="sm"
                                    >
                                        {updatingUid === u.uid && <Loader2 className="animate-spin" />} Admin
                                    </Button>
                                     <Button
                                        onClick={() => updateRole(u.uid, "super_admin")}
                                        disabled={!!updatingUid}
                                         variant={u.role === 'super_admin' ? 'destructive' : 'outline'}
                                        size="sm"
                                    >
                                        {updatingUid === u.uid && <Loader2 className="animate-spin" />} Super Admin
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    </Protected>
  );
}
