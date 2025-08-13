'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function TeamPage() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('agent');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Inviting ${email} as ${role}`);
    // Placeholder for actual invite logic
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Team Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Invite New Member</CardTitle>
          <CardDescription>Send an invitation to a new team member to join your company.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="teammate@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
               <Select name="role" value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="collections">Collections</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Send Invite</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
