'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/firebase/client';
import { doc, getDoc } from 'firebase/firestore';

import { ReportIdentitySection } from '@/components/reports/ReportIdentitySection';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

export default function RenterProfilePage() {
  const { id } = useParams();
  const [renter, setRenter] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoading(true);

      const renterRef = doc(db, 'renters', id as string);
      const renterSnap = await getDoc(renterRef);

      if (renterSnap.exists()) {
        setRenter(renterSnap.data());
      } else {
        setRenter(null);
      }

      setLoading(false);
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="animate-spin w-6 h-6 text-slate-600" />
      </div>
    );
  }

  if (!renter) {
    return <div className="p-8 text-center text-slate-600">Renter not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto pt-8 pb-20 space-y-6">
      {/* A basic renter profile header */}
      <Card>
        <CardHeader>
          <CardTitle>{renter.firstName} {renter.lastName}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{renter.email}</p>
          <div className="flex space-x-2">
            {renter.identityCheckPaidAt ? (
              <Badge className="bg-emerald-600 text-white">ID Verified Payment ✓</Badge>
            ) : (
              <Badge variant="outline" className="border-red-500 text-red-600">
                ID Check Required ($4.99)
              </Badge>
            )}

            {renter.reportPaidAt ? (
              <Badge className="bg-emerald-600 text-white">Report Unlocked ✓</Badge>
            ) : (
              <Badge variant="outline" className="border-red-500 text-red-600">
                Report Locked ($20)
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Identity Overview</CardTitle>
        </CardHeader>

        <CardContent>
          <ReportIdentitySection
            renter={renter}
            fraudSignals={renter.fraudSignals ?? {}}
            matchScore={renter.matchScore ?? 0}
          />
        </CardContent>
      </Card>
    </div>
  );
}
