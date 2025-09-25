
"use client";

import { useState, useEffect } from "react";
import { db } from "@/firebase/client";
import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import Protected from "@/components/protected";

type Role = 'editor' | 'admin';

export default function InvitesPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("editor");
  const [invites, setInvites] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingInvites, setLoadingInvites] = useState(true);

  const loadInvites = async () => {
    setLoadingInvites(true);
    const snap = await getDocs(collection(db, "invites"));
    setInvites(snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a,b) => b.createdAt.toMillis() - a.createdAt.toMillis()));
    setLoadingInvites(false);
  };

  useEffect(() => {
    loadInvites();
  }, []);

  const createInvite = async () => {
    if (!email) {
        toast({ title: "Email required", description: "Please enter an email address to send an invite.", variant: "destructive"});
        return;
    };
    setLoading(true);

    const token = uuidv4();
    try {
        await addDoc(collection(db, "invites"), {
            email,
            role,
            token,
            createdAt: Timestamp.now(),
            accepted: false,
        });

        toast({
            title: "Invite Created",
            description: "Share this secure link with the new team member.",
            action: (
                <div className="mt-2">
                    <Input readOnly value={`${window.location.origin}/invite/${token}`} />
                </div>
            )
        })

        setEmail("");
        loadInvites();
    } catch(e: any) {
        toast({ title: "Failed to create invite", description: e.message, variant: "destructive"});
    } finally {
        setLoading(false);
    }
  };

  return (
    <Protected roles={['owner', 'manager']}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold font-headline">Team Invites</h1>

        <Card>
            <CardHeader>
                <CardTitle>Invite New Team Member</CardTitle>
                <CardDescription>Send an invitation to a new team member to join your company.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-4">
                <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="teammate@example.com"
                    className="flex-1"
                />
                <Select value={role} onValueChange={(v: Role) => setRole(v)}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                </Select>
                <Button onClick={createInvite} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Invite
                </Button>
            </CardContent>
        </Card>

        <Card>
             <CardHeader>
                <CardTitle>Invite History</CardTitle>
                <CardDescription>A log of all invites sent for this company.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date Sent</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loadingInvites ? (
                            <TableRow><TableCell colSpan={4} className="text-center">Loading invites...</TableCell></TableRow>
                        ) : invites.length === 0 ? (
                            <TableRow><TableCell colSpan={4} className="text-center">No invites sent yet.</TableCell></TableRow>
                        ) : (
                            invites.map((i) => (
                            <TableRow key={i.id}>
                                <TableCell className="font-medium">{i.email}</TableCell>
                                <TableCell className="capitalize">{i.role}</TableCell>
                                <TableCell>
                                    <Badge variant={i.accepted ? "default" : "secondary"}>
                                        {i.accepted ? "Accepted" : "Pending"}
                                    </Badge>
                                </TableCell>
                                <TableCell>{i.createdAt.toDate().toLocaleDateString()}</TableCell>
                            </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </Protected>
  );
}
