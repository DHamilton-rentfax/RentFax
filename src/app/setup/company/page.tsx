'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { setUserClaims } from '@/app/auth/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Protected from '@/components/protected';


export default function CompanySetupPage() {
  const [companyName, setCompanyName] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleCreate = async () => {
    if (!companyName.trim()) {
        toast({ title: "Company Name Required", description: "Please enter a name for your company.", variant: "destructive" });
        return;
    };
    setSaving(true);

    try {
      // 1) Create company doc via our new API route
      const res = await fetch('/api/company/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${await auth.currentUser?.getIdToken()}` },
        body: JSON.stringify({ name: companyName })
      });
      
      if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to create company.');
      }

      const { companyId } = await res.json();

      // 2) Set claims via callable (server action)
      await setUserClaims({ uid: auth.currentUser!.uid, role: 'owner', companyId });

      // 3) Refresh token to pick up claims
      await auth.currentUser?.getIdToken(true);
      
      toast({ title: "Company Created!", description: "You are now being redirected to your dashboard." });
      router.push('/dashboard');

    } catch (e: any) {
      console.error(e);
      toast({ title: "Setup Failed", description: e.message || 'An unexpected error occurred.', variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Protected>
        <div className="flex items-center justify-center min-h-screen bg-muted/40">
        <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
            <CardTitle className="font-headline text-2xl">Set Up Your Company</CardTitle>
            <CardDescription>
                This will be your workspace in RentFAX.
            </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input id="company-name" placeholder="e.g., Acme Rentals" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
            </CardContent>
            <CardFooter>
            <Button onClick={handleCreate} disabled={saving} className="w-full">
                {saving ? 'Creating…' : 'Create & Continue'}
            </Button>
            </CardFooter>
        </Card>
        </div>
    </Protected>
  );
}
