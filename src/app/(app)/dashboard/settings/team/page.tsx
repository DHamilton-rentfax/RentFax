
'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { createInvite } from '@/app/auth/actions';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import Protected from '@/components/protected';

const ROLES = ['admin', 'editor'] as const;
type Role = typeof ROLES[number];

export default function TeamPage() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('editor');
  const [loading, setLoading] = useState(false);
  const [invites, setInvites] = useState<any[]>([]);
  const [loadingInvites, setLoadingInvites] = useState(true);
  const { toast } = useToast();
  const { claims } = useAuth();

  useEffect(() => {
    if (!claims?.companyId) return;
    setLoadingInvites(true);
    const q = query(collection(db, 'invites'), where('companyId', '==', claims.companyId), where('status', '==', 'pending'));
    const unsub = onSnapshot(q, (snap) => {
        setInvites(snap.docs.map(d => ({id: d.id, ...d.data()})));
        setLoadingInvites(false);
    });
    return () => unsub();
  }, [claims?.companyId]);


  const handleInvite = async () => {
    setLoading(true);
    try {
      const result = await createInvite({ email, role });
      toast({
        title: 'Invite Sent!',
        description: (
          <div>
            <p>Share this secure link with the new team member:</p>
            <Input readOnly value={result.acceptUrl} className="mt-2" />
          </div>
        )
      });
      setEmail('');
    } catch (err: any) {
      toast({ title: 'Failed to send invite', description: err.message || 'An error occurred.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Protected roles={['owner', 'admin']}>
        <div className="space-y-6">
        <h1 className="text-3xl font-bold font-headline">Team Management</h1>
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                <CardTitle>Invite New Member</CardTitle>
                <CardDescription>Send an invitation to a new team member to join your company.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            placeholder="teammate@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select value={role} onValueChange={(value: Role) => setRole(value)}>
                            <SelectTrigger id="role" className="w-full">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                {ROLES.map(r => <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleInvite} disabled={loading || !email}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {loading ? 'Sending...' : 'Send Invite'}
                    </Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                <CardTitle>Pending Invites</CardTitle>
                <CardDescription>These invites have been sent but not yet accepted.</CardDescription>
                </CardHeader>
                <CardContent>
                {loadingInvites ? <p>Loading...</p> : invites.length === 0 ? (
                    <p className="text-muted-foreground">No pending invites.</p>
                ) : (
                    <ul className="space-y-2 text-sm">
                    {invites.map((invite) => (
                        <li key={invite.id} className="p-2 bg-secondary rounded-md flex justify-between items-center">
                            <span>{invite.email}</span>
                            <span className="capitalize font-medium bg-background px-2 py-1 rounded-md">{invite.role}</span>
                        </li>
                    ))}
                    </ul>
                )}
                </CardContent>
            </Card>
        </div>
        </div>
    </Protected>
  );
}
