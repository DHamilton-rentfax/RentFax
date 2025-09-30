'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, User, Car, DollarSign, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import FeatureGate from '@/components/feature-gate';
import IncidentAssistPanel from '@/components/incident-assist-panel';

export default function IncidentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { toast } = useToast();

  const [incident, setIncident] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const unsub = onSnapshot(doc(db, 'incidents', id), (doc) => {
      if (doc.exists()) {
        setIncident({ id: doc.id, ...doc.data() });
      } else {
        toast({ title: 'Error', description: 'Incident not found.', variant: 'destructive' });
        router.push('/incidents');
      }
      setLoading(false);
    });
    return () => unsub();
  }, [id, router, toast]);

  if (loading) {
    return (
      <div className="p-4 md:p-10 space-y-6">
        <Skeleton className="h-8 w-1/4" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="md:col-span-1 h-48 w-full" />
          <Skeleton className="md:col-span-2 h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!incident) {
    return null;
  }
  
  return (
    <div className="p-4 md:p-10">
      <Button variant="outline" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column - Details */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="capitalize">{incident.type} Incident</CardTitle>
              <CardDescription>ID: {incident.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Severity</p>
                <Badge variant={incident.severity === 'severe' ? 'destructive' : 'secondary'}>{incident.severity}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium flex items-center gap-2"><CalendarIcon className="w-4 h-4" /> Date</p>
                <p className="text-muted-foreground">
                  {format(incident.createdAt.toDate(), 'PPP')}
                </p>
              </div>
               <div>
                <p className="text-sm font-medium flex items-center gap-2"><DollarSign className="w-4 h-4" /> Amount</p>
                <p className="text-muted-foreground">
                  ${incident.amount || 0}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium flex items-center gap-2"><User className="w-4 h-4" /> Renter ID</p>
                <p className="text-muted-foreground font-mono text-xs">{incident.renterId}</p>
              </div>
               <div>
                <p className="text-sm font-medium flex items-center gap-2"><Car className="w-4 h-4" /> Rental ID</p>
                <p className="text-muted-foreground font-mono text-xs">{incident.rentalId || 'N/A'}</p>
              </div>
               <div>
                <p className="text-sm font-medium">Notes</p>
                <p className="text-muted-foreground text-sm">{incident.notes || 'No notes provided.'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - AI Assist */}
        <div className="md:col-span-2">
            <FeatureGate name="ai_assistant">
                <IncidentAssistPanel id={id} />
            </FeatureGate>
        </div>
      </div>
    </div>
  );
}
