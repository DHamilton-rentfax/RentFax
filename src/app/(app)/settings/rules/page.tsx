'use client';
import { useEffect, useState } from 'react';
import Protected from '@/components/protected';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function RulesSettings() {
  const { claims } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [companyId, setCompanyId] = useState('');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [primary, setPrimary] = useState('#3F51B5');
  
  const [driverEligibility, setDriverEligibility] = useState('');
  const [fees, setFees] = useState('');
  const [smoking, setSmoking] = useState('');
  const [other, setOther] = useState('');

  useEffect(() => {
    if (claims?.companyId) {
      setCompanyId(claims.companyId);
    }
  }, [claims]);

  useEffect(() => {
    if (!companyId) return;
    (async () => {
      setLoading(true);
      try {
        const c = await getDoc(doc(db, 'companies', companyId));
        if (c.exists()) {
          const d = c.data() as any;
          setName(d.name || '');
          setSlug(d.slug || '');
          setLogoUrl(d.brand?.logoUrl || '');
          setPrimary(d.brand?.primary || '#3F51B5');
        }
        // Using a separate doc for rules is a good pattern
        const rs = await getDoc(doc(db, 'companyRules', companyId));
        if (rs.exists()) {
          const r = rs.data() as any;
          setDriverEligibility(r.driverEligibility || '');
          setFees(r.fees || '');
          setSmoking(r.smoking || '');
          setOther(r.other || '');
        }
      } catch (error: any) {
        toast({ title: 'Error loading settings', description: error.message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    })();
  }, [companyId, toast]);

  const save = async () => {
    if (!companyId) return;
    setSaving(true);
    try {
      // Enforce slug uniqueness
      if (slug) {
        const q = query(collection(db, 'companies'), where('slug', '==', slug));
        const snap = await getDocs(q);
        const isUnique = snap.empty || (snap.docs.length === 1 && snap.docs[0].id === companyId);
        if (!isUnique) {
          toast({ title: 'Slug is already taken', variant: 'destructive' });
          setSaving(false);
          return;
        }
      }
      await setDoc(doc(db, 'companies', companyId), { name, slug, brand: { logoUrl, primary } }, { merge: true });
      await setDoc(doc(db, 'companyRules', companyId), { driverEligibility, fees, smoking, other }, { merge: true });
      toast({ title: 'Settings Saved!' });
    } catch (error: any) {
      toast({ title: 'Failed to save', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
        <div className="p-4 md:p-10 max-w-2xl mx-auto space-y-4">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
    )
  }

  return (
    <Protected roles={['owner', 'manager']}>
      <div className="max-w-2xl mx-auto p-4 md:p-10">
        <h1 className="text-2xl md:text-3xl font-headline mb-6">Public Rules & Branding</h1>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Branding</CardTitle>
                    <CardDescription>Customize the look of your public rules page.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="slug">Public Slug (URL)</Label>
                        <Input id="slug" value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} placeholder="your-company-name"/>
                        <p className="text-sm text-muted-foreground">Short, unique, and URL-friendly.</p>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="logo">Logo URL</Label>
                        <Input id="logo" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="https://your-site.com/logo.png"/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="color">Brand Color</Label>
                        <Input id="color" type="color" value={primary} onChange={e => setPrimary(e.target.value)} className="w-24"/>
                    </div>
                </CardContent>
            </Card>

            <Card>
                 <CardHeader>
                    <CardTitle>Rule Content</CardTitle>
                    <CardDescription>Define the policies that will be displayed on your public rules page.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="eligibility">Driver Eligibility</Label>
                        <Textarea id="eligibility" placeholder="e.g., Must be 21+ with a valid license..." value={driverEligibility} onChange={e=>setDriverEligibility(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="fees">Fees & Deposits</Label>
                        <Textarea id="fees" placeholder="e.g., A security deposit of $500 is required..." value={fees} onChange={e=>setFees(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="smoking">Smoking & Cleanliness</Label>
                        <Textarea id="smoking" placeholder="e.g., Smoking of any kind is strictly prohibited. A $250 fee applies." value={smoking} onChange={e=>setSmoking(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="other">Other Policies</Label>
                        <Textarea id="other" placeholder="Any other rules or terms." value={other} onChange={e=>setOther(e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-center gap-4">
                <Button onClick={save} disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Settings
                </Button>
                 {slug && <Button asChild variant="outline"><Link href={`/rules/${slug}`} target="_blank">View Public Page</Link></Button>}
            </div>
        </div>
      </div>
    </Protected>
  );
}
