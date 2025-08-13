'use client';

import { useEffect, useState } from 'react';
import Protected from '@/components/protected';
import { createInvite } from '@/app/auth/actions';
import { fetchClaims } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const ROLES = ['manager', 'agent', 'collections'] as const;
type Role = typeof ROLES[number];

export default function TeamSettings() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('agent');
  const [invites, setInvites] = useState<any[]>([]);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchClaims().then((res) => setCompanyId(res?.claims?.companyId));
  }, []);

  const sendInvite = async () => {
    if (!email) {
      toast({ title: "Email required", description: "Please enter an email to send an invite.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await createInvite({ email, role });
      toast({ 
        title: "Invite Sent!", 
        description: (
            <div>
                <p>Share this link with the user:</p>
                <Input readOnly defaultValue={res.acceptUrl} className="mt-2" />
            </div>
        )
      });
      setEmail('');
      // You would re-fetch invites here
    } catch (e: any) {
        toast({ title: "Failed to send invite", description: e.message || 'An error occurred.', variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };

  // In a real app, you would fetch and display pending invites here.
  // This is a placeholder as we haven't built the invite listing API yet.

  return (
    <Protected roles={['owner', 'manager']}>
      <div className="space-y-6">
        <div>
            <h3 className="text-lg font-medium">Team Management</h3>
            <p className="text-sm text-muted-foreground">
                Invite new team members and manage roles.
            </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
            <Card>
            <CardHeader>
                <CardTitle>Invite Teammate</CardTitle>
                <CardDescription>
                Send an invitation to a new team member to join your company on RentFAX.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" placeholder="email@company.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={role} onValueChange={(value: Role) => setRole(value)}>
                        <SelectTrigger id="role">
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                            {ROLES.map(r => <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={sendInvite} disabled={loading} className="w-full">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Invite
                </Button>
            </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Pending Invites</CardTitle>
                    <CardDescription>
                    These users have been invited but have not yet joined.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Placeholder content */}
                    <div className="text-center text-muted-foreground py-8">
                        <p>No pending invites.</p>
                        <p className="text-sm">Feature to list invites coming soon.</p>
                    </div>
                </CardContent>
            </Card>
        </div>

      </div>
    </Protected>
  );
}
