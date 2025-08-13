
'use client';
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function RulesPage() {
  const { claims } = useAuth();
  const [settings, setSettings] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!claims?.companyId) return;
    const fetchSettings = async () => {
      setLoading(true);
      const docRef = doc(db, 'companyRules', claims.companyId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
      setLoading(false);
    };
    fetchSettings();
  }, [claims?.companyId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!claims?.companyId) return;
    setSaving(true);
    try {
        const docRef = doc(db, 'companyRules', claims.companyId);
        await setDoc(docRef, settings, { merge: true });
        toast({ title: "Settings Saved", description: "Your rules and branding have been updated." });
    } catch(e: any) {
        toast({ title: "Error Saving", description: e.message, variant: "destructive" });
    } finally {
        setSaving(false);
    }
  };

  if (loading) {
      return <p>Loading settings...</p>
  }

  return (
    <div className="space-y-6">
       <h1 className="text-3xl font-bold font-headline">Rules & Branding</h1>
      <Card>
        <CardHeader>
          <CardTitle>Company Rules</CardTitle>
          <CardDescription>
            These rules will be displayed on your public-facing rental rules page. Use clear and concise language.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="driverEligibility">Driver Eligibility</Label>
                <Textarea id="driverEligibility" name="driverEligibility" placeholder="e.g., Valid license, 25+, no major violations..." value={settings.driverEligibility || ''} onChange={handleChange} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="fees">Fees & Deposits</Label>
                <Textarea id="fees" name="fees" placeholder="e.g., Deposit $200–$300; late return $25/hr." value={settings.fees || ''} onChange={handleChange} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="smoking">Smoking & Cleanliness</Label>
                <Textarea id="smoking" name="smoking" placeholder="e.g., Strictly no smoking. $150 fee for violations." value={settings.smoking || ''} onChange={handleChange} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="other">Other Policies</Label>
                <Textarea id="other" name="other" placeholder="e.g., Additional terms may apply." value={settings.other || ''} onChange={handleChange} />
            </div>
        </CardContent>
      </Card>
      <Card>
         <CardHeader>
          <CardTitle>Branding</CardTitle>
           <CardDescription>
            Customize the look of your public rules page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
             <div className="space-y-2">
                <Label htmlFor="brandColor">Brand Color</Label>
                <Input id="brandColor" name="brand.primary" placeholder="#3F51B5" value={settings.brand?.primary || ''} onChange={handleChange} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input id="logoUrl" name="brand.logoUrl" placeholder="https://your-cdn.com/logo.png" value={settings.brand?.logoUrl || ''} onChange={handleChange} />
            </div>
        </CardContent>
      </Card>
       <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="mr-2 animate-spin" /> : null}
            {saving ? 'Saving…' : 'Save All Settings'}
          </Button>
        </div>
    </div>
  );
}
