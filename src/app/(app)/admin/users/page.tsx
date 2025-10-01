
'use client';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

const ROLES = ["super_admin", "admin", "editor", "reviewer", "user", "banned"];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch('/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setUsers(data.users);
      } catch (e: any) {
        toast({ title: "Failed to load users", description: e.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [toast]);
  
  const handleRoleChange = async (uid: string, role: string) => {
    try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch('/api/admin/roles', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid, role })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update role.');
        
        setUsers(users.map(u => u.uid === uid ? {...u, role} : u));
        toast({ title: "Role Updated", description: "User role has been successfully updated." });
    } catch(e: any) {
        toast({ title: "Update Failed", description: e.message, variant: "destructive" });
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-headline">User Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Platform Users</CardTitle>
          <CardDescription>View and manage roles for all users in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Company ID</TableHead>
                <TableHead>Last Sign-In</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                 Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-28" /></TableCell>
                    </TableRow>
                ))
              ) : users.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell className="font-mono text-xs">{user.companyId || 'N/A'}</TableCell>
                  <TableCell>
                      {user.lastSignIn ? formatDistanceToNow(new Date(user.lastSignIn), { addSuffix: true }) : 'Never'}
                  </TableCell>
                  <TableCell>
                    <Select defaultValue={user.role} onValueChange={(value) => handleRoleChange(user.uid, value)} disabled={user.uid === auth.currentUser?.uid}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Set role" />
                        </SelectTrigger>
                        <SelectContent>
                            {ROLES.map(r => <SelectItem key={r} value={r} className="capitalize">{r.replace('_', ' ')}</SelectItem>)}
                        </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
