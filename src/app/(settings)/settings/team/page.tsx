
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { createInvite } from '@/app/auth/actions';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ROLES = ['manager', 'agent', 'collections'] as const;
type Role = typeof ROLES[number];

export default function TeamSettingsPage() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('agent');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
    <div className="space-y-6">
        <div>
            <h3 className="text-lg font-medium">Team Management</h3>
            <p className="text-sm text-muted-foreground">
                Invite new team members and manage existing roles.
            </p>
        </div>
        <Card>
        <CardHeader>
            <CardTitle>Invite a new member</CardTitle>
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
    </div>
  );
}
