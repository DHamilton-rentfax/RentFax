
'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import RenterActions from '@/components/renter-actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// In a real app, this would be a more sophisticated API call
async function getOrgUsers(orgId: string) {
    // This is a simplified client-side query for demonstration.
    // In a production app, you'd have a secure Cloud Function to list users by org.
    const users: any[] = [];
    const q = query(collection(db, "users"), where("companyId", "==", orgId));
    const snap = await getDocs(q);
    snap.forEach(doc => {
        users.push({ uid: doc.id, ...doc.data() });
    });
    return users;
}


export default function TeamPage() {
  const { toast } = useToast();
  const { claims } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!claims?.companyId) return;
    // In a real app, you would have a secure backend endpoint to fetch users by org
    // For this prototype, we are using a simplified Firestore query
    const unsub = onSnapshot(query(collection(db, "users"), where("companyId", "==", claims.companyId)), (snap) => {
        const memberData = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
        setMembers(memberData);
        setLoading(false);
    });
    return () => unsub();
  }, [claims?.companyId]);
  
  const handleRoleChange = async (uid: string, role: string) => {
    // In a real app, this would be a secure call to a Cloud Function (e.g., setUserClaims)
    console.log(`TODO: Change user ${uid} to role ${role}`);
    toast({ title: "Role change simulated", description: "In a real app, this would call a secure backend function."});
  }

  return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline">Team Management</h1>
                <RenterActions />
            </div>
        
            <Card>
                <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>Manage roles and permissions for your team.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                 Array.from({length: 2}).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            ) : members.map(member => (
                                <TableRow key={member.uid}>
                                    <TableCell>
                                        <div className="font-medium">{member.displayName || member.email}</div>
                                        <div className="text-sm text-muted-foreground">{member.email}</div>
                                    </TableCell>
                                    <TableCell className="capitalize">
                                        {member.role}
                                    </TableCell>
                                    <TableCell className="text-right">
                                       <Select defaultValue={member.role} onValueChange={(value) => handleRoleChange(member.uid, value)}>
                                            <SelectTrigger className="w-[140px] ml-auto">
                                                <SelectValue placeholder="Set role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="owner">Owner</SelectItem>
                                                <SelectItem value="manager">Manager</SelectItem>
                                                <SelectItem value="agent">Agent</SelectItem>
                                                <SelectItem value="collections">Collections</SelectItem>
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
