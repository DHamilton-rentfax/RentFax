'use client';
import { useEffect, useMemo, useState } from 'react';
import Protected from '@/components/protected';
import Checklist, { Check } from '@/components/checklist';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import {
  collection, query, where, limit, getDocs, doc, getDoc, orderBy
} from 'firebase/firestore';
import { health as healthFlow } from '@/app/auth/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';


type HealthResp = {
  ok: boolean;
  version: string;
  timestamp: string;
  env: Record<string, boolean>;
};

export default function ReadinessPage() {
  const { claims } = useAuth();
  const [companyId, setCompanyId] = useState<string>('');
  const [company, setCompany] = useState<any>(null);
  const [counts, setCounts] = useState<Record<string, number>>({ renters: -1, rentals: -1, incidents: -1, disputes: -1, invites: -1, mailQueued: -1 });
  const [health, setHealth] = useState<HealthResp | null>(null);
  const [indexOK, setIndexOK] = useState<boolean | null>(null);
  const [scoreOK, setScoreOK] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (claims?.companyId) {
        setCompanyId(claims.companyId);
    } else if (claims) { // claims loaded but no companyId
        setLoading(false);
    }
  }, [claims]);

  useEffect(() => {
    if (!companyId) return;
    (async () => {
      setLoading(true);
      // Company doc
      const c = await getDoc(doc(db, 'companies', companyId));
      if (c.exists()) setCompany({ id: c.id, ...c.data() });

      // Counts
      const runCount = async (col: string) => {
        const snap = await getDocs(query(collection(db, col), where('companyId','==', companyId), limit(100)));
        return snap.size;
      };
      const [renters, rentals, incidents, disputes] = await Promise.all([
        runCount('renters'), runCount('rentals'), runCount('incidents'), runCount('disputes')
      ]);

      const invSnap = await getDocs(query(collection(db, 'invites'), where('companyId','==', companyId), where('status','==','pending')));
      const invites = invSnap.size;

      let mailQueued = 0;
      try {
        const m = await getDocs(query(collection(db, 'mail'), limit(10)));
        mailQueued = m.size;
      } catch { mailQueued = -1; /* ignore if access denied */ }

      setCounts({ renters, rentals, incidents, disputes, invites, mailQueued });

      // Index probe
      try {
        await getDocs(query(
          collection(db, 'rentals'),
          where('companyId','==', companyId),
          where('status','==','active'),
          orderBy('startAt','desc'),
          limit(1)
        ));
        setIndexOK(true);
      } catch (e: any) {
        setIndexOK(false);
      }

      // Score probe
      try {
        const rs = await getDocs(query(collection(db, 'renters'), where('companyId','==', companyId), where('riskScore','>=', 0), limit(1)));
        setScoreOK(rs.size > 0);
      } catch { setScoreOK(false); }

      // Functions health
      try {
        const healthData = await healthFlow();
        setHealth(healthData);
      } catch {
        setHealth({ ok: false, version: 'unknown', timestamp: new Date().toISOString(), env: {} });
      }
      setLoading(false);
    })();
  }, [companyId]);

  const checks: Check[] = useMemo(() => {
    const plan = company?.plan || '...';
    const status = company?.status || '...';
    const envFlags = health?.env || {};

    return [
      { id: 'plan', label: `Company plan active`, pass: company ? status === 'active' : null, hint: `Status: ${status}, Plan: ${plan}`, link: '/settings/billing' },
      { id: 'functions', label: `Cloud Functions reachable`, pass: !!health?.ok, hint: `Version ${health?.version || '...'} @ ${health?.timestamp || ''}` },
      { id: 'env', label: 'Critical env vars set (Stripe, Tasks, Email)', pass: Object.keys(envFlags).length ? Object.values(envFlags).every(Boolean) : null, hint: `Found: ${Object.entries(envFlags).filter(([,v])=>v).length} of ${Object.keys(envFlags).length}` },
      { id: 'data-min', label: 'Seeded data present (renters/rentals/etc)', pass: counts.renters>0 && counts.rentals>0 && counts.incidents>0 && counts.disputes>0, hint: `renters=${counts.renters}, rentals=${counts.rentals}, incidents=${counts.incidents}`, link: '/admin/seed' },
      { id: 'invites', label: 'Invite flow configured', pass: counts.invites>=0, hint: `Pending invites: ${counts.invites}`, link: '/settings/team' },
      { id: 'risk', label: 'Risk score engine updating renters', pass: scoreOK, hint: scoreOK ? 'At least one renter has a score' : 'No score found yet; create an incident to trigger' },
      { id: 'indexes', label: 'Composite indexes in place (probe query OK)', pass: indexOK, hint: 'If false, run firebase deploy --only firestore:indexes' },
      { id: 'mail', label: 'Email pipeline installed (e.g., SendGrid)', pass: counts.mailQueued >= 0, hint: `Mail queue size: ${counts.mailQueued === -1 ? 'Unknown' : counts.mailQueued}` },
    ];
  }, [company, counts, health, indexOK, scoreOK]);

  const passAll = checks.every(c => c.pass === true);

  if (loading) {
     return (
        <div className="p-4 md:p-10 max-w-3xl mx-auto space-y-4">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-48 w-full" />
        </div>
    )
  }

  return (
    <Protected roles={['owner','manager','superadmin']}>
      <div className="max-w-3xl mx-auto p-4 md:p-10 space-y-6">
        <div>
            <h1 className="text-2xl md:text-3xl font-headline">Go‑Live Checklist</h1>
             {company && (
                <p className="text-muted-foreground">
                    Company: <b>{company.name}</b>
                </p>
            )}
        </div>
        
        <Checklist items={checks} />

        <Card className={passAll ? 'bg-green-100 dark:bg-green-900/20 border-green-500/50' : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500/50'}>
            <CardHeader>
                <CardTitle className={passAll ? 'text-green-900 dark:text-green-200' : 'text-yellow-900 dark:text-yellow-200'}>
                    {passAll ? '✅ Ready to Launch' : '⚠️ Not Ready Yet'}
                </CardTitle>
            </CardHeader>
            {!passAll && 
                <CardContent className={passAll ? 'text-green-800 dark:text-green-300' : 'text-yellow-800 dark:text-yellow-300'}>
                    Fix the failed items above (marked with an "!") and refresh the page.
                </CardContent>
            }
        </Card>
      </div>
    </Protected>
  );
}
