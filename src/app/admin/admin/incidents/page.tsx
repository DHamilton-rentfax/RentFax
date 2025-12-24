'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/firebase/client';
import { doc, getDoc } from 'firebase/firestore';

import { ReportIdentitySection } from '@/components/reports/ReportIdentitySection';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import SupportChat from '@/components/support/SupportChat';

export default function IncidentDetailPage() {
  const { id } = useParams();
  const [incident, setIncident] = useState<any>(null);
  const [renter, setRenter] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoading(true);

      const incidentRef = doc(db, 'incidents', id as string);
      const incidentSnap = await getDoc(incidentRef);

      if (incidentSnap.exists()) {
        const incidentData = incidentSnap.data();
        setIncident(incidentData);

        if (incidentData.renterId) {
          const renterRef = doc(db, 'renters', incidentData.renterId);
          const renterSnap = await getDoc(renterRef);
          setRenter(renterSnap.exists() ? renterSnap.data() : null);
        }
      } else {
        setIncident(null);
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

  if (!incident) {
    return (
      <div className="p-8 text-center text-slate-600">Incident not found.</div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pt-8 pb-20 space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Incident Details</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{incident.description}</p>
            </CardContent>
        </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Identity Verification</CardTitle>
        </CardHeader>

        <CardContent>
          <ReportIdentitySection
            renter={renter}
            fraudSignals={incident.fraudSignals ?? {}}
            matchScore={incident.matchScore ?? 0}
          />
        </CardContent>
      </Card>
      <SupportChat context="admin_incident_view" />
    </div>
  );
}
