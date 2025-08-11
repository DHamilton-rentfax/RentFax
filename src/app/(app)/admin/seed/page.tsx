'use client';
import Protected from '@/components/protected';
import { useState } from 'react';
import { seedStaging } from '@/app/auth/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function SeedPage() {
  const [companyName, setCompanyName] = useState('RentFAX Demo Co');
  const [ownerEmail, setOwnerEmail] = useState(`owner.demo+${Date.now()}@example.com`);
  const [managerEmail, setManagerEmail] = useState(`manager.demo+${Date.now()}@example.com`);
  const [overwrite, setOverwrite] = useState(false);
  const [out, setOut] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  const run = async () => {
    setBusy(true); 
    setOut(null);
    try {
      const res = await seedStaging({ companyName, ownerEmail, managerEmail, overwrite });
      setOut(res);
      toast({ title: 'Seed Successful!', description: 'Staging data has been created.' });
    } catch (e: any) {
      toast({ title: 'Seed Failed', description: e.message || 'An unexpected error occurred.', variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Protected roles={['superadmin']}>
      <div className="p-4 md:p-10 max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-headline">Seed Staging Data</h1>
        <Card>
            <CardHeader>
                <CardTitle>Seeder Configuration</CardTitle>
                <CardDescription>
                    Configure and run the seeder to populate your environment with demo data. This action is restricted to superadmins.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" value={companyName} onChange={e=>setCompanyName(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="ownerEmail">Owner Email</Label>
                    <Input id="ownerEmail" value={ownerEmail} onChange={e=>setOwnerEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="managerEmail">Manager Email</Label>
                    <Input id="managerEmail" value={managerEmail} onChange={e=>setManagerEmail(e.target.value)} />
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="overwrite" checked={overwrite} onCheckedChange={(checked) => setOverwrite(Boolean(checked))} />
                    <Label htmlFor="overwrite">
                        Overwrite existing company (by slug)
                    </Label>
                </div>
            </CardContent>
            <CardFooter>
                 <Button disabled={busy} onClick={run}>
                    {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {busy ? 'Seeding…' : 'Run Seed'}
                </Button>
            </CardFooter>
        </Card>

        {out && (
          <Card>
            <CardHeader>
                <CardTitle>Seed Output</CardTitle>
            </CardHeader>
            <CardContent>
                <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
                    {JSON.stringify(out, null, 2)}
                </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </Protected>
  );
}
