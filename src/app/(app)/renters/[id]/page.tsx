'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Calendar as CalendarIcon,
  CreditCard,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import RenterTimeline from '@/components/renter-timeline';
import { Skeleton } from '@/components/ui/skeleton';
import RenterActions from '@/components/renter-actions';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import FeatureGate from '@/components/feature-gate';
import RiskExplainPanel from '@/components/risk-explain-panel';
import FraudSignalsPanel from '@/components/fraud-signals-panel';

export default function RenterDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [renter, setRenter] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const unsub = onSnapshot(doc(db, "renters", id), (doc) => {
        if (doc.exists()) {
          setRenter({ id: doc.id, ...doc.data()});
        }
        setLoading(false);
      });
      return () => unsub();
    }
  }, [id]);

  if (loading) {
    return (
       <div className="p-4 md:p-10 space-y-6">
        <Skeleton className="h-8 w-1/4" />
        <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-1 space-y-6">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
            <div className="md:col-span-2">
                 <Skeleton className="h-[500px] w-full" />
            </div>
        </div>
      </div>
    );
  }

  if (!renter) {
    return <div>Renter not found</div>;
  }
  
  const name = `${renter.firstName || ''} ${renter.lastName || ''}`.trim() || renter.name;

  return (
    <div className="p-4 md:p-10">
        <div className="flex items-start justify-between mb-6">
            <div>
                <h1 className="text-3xl font-headline">{name}</h1>
                <p className="text-muted-foreground">Renter Profile & History</p>
            </div>
            <RenterActions renter={renter}/>
        </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Renter Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <Avatar className="h-24 w-24 text-3xl">
                  <AvatarImage src={renter.imageUrl} alt={name} />
                  <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex items-center gap-4">
                <User className="h-5 w-5 text-muted-foreground" />
                <span>{name}</span>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <a href={`mailto:${renter.email}`} className="text-primary hover:underline">
                  {renter.email}
                </a>
              </div>
               <div className="flex items-center gap-4">
                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                <span>Born on {new Date(renter.dob).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-4">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <span>{renter.licenseState} - {renter.licenseNumber}</span>
              </div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShieldAlert className="text-primary"/>
                    Risk Profile
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-center">
                    <p className="text-6xl font-bold">{renter.riskScore}</p>
                    <p className="text-muted-foreground">Risk Score</p>
                </div>
                <FeatureGate name="ai_assistant">
                    <RiskExplainPanel renterId={renter.id} />
                </FeatureGate>
                 <p className="text-sm text-muted-foreground pt-4 text-center">
                    Based on {renter.totalIncidents || 0} incidents and payment history.
                </p>
            </CardContent>
          </Card>
          <FeatureGate name="fraud_graph">
            <FraudSignalsPanel renter={renter} />
          </FeatureGate>
        </div>

        {/* Right Column (Timeline) */}
        <div className="md:col-span-2">
          <RenterTimeline renterId={renter.id} />
        </div>
      </div>
    </div>
  );
}
