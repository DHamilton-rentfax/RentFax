'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  User,
  Phone,
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
import { Renter } from '@/lib/mock-data';
import { Skeleton } from '@/components/ui/skeleton';
import RenterActions from '@/components/renter-actions';

export default function RenterDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [renter, setRenter] = useState<Renter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // In a real app, you'd fetch a single renter by ID.
      // We'll filter the mock data for this example.
      fetch('/api/mock-data?type=renters')
        .then((res) => res.json())
        .then((data) => {
          const foundRenter = data.find((r: Renter) => r.id === id);
          setRenter(foundRenter);
          setLoading(false);
        });
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

  return (
    <div className="p-4 md:p-10">
        <div className="flex items-start justify-between mb-6">
            <div>
                <h1 className="text-3xl font-headline">{renter.name}</h1>
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
                  <AvatarImage src={renter.imageUrl} alt={renter.name} />
                  <AvatarFallback>{renter.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex items-center gap-4">
                <User className="h-5 w-5 text-muted-foreground" />
                <span>{renter.name}</span>
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
            <CardContent className="space-y-4 text-center">
                <div>
                    <p className="text-6xl font-bold">{renter.riskScore}</p>
                    <p className="text-muted-foreground">Risk Score</p>
                </div>
                <div>
                    <Badge variant={renter.riskScore > 75 ? 'destructive' : 'default'} className="text-lg">
                        {renter.status}
                    </Badge>
                </div>
                 <p className="text-sm text-muted-foreground pt-4">
                    Based on {renter.totalIncidents} incidents and payment history.
                </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Timeline) */}
        <div className="md:col-span-2">
          <RenterTimeline renterId={renter.id} />
        </div>
      </div>
    </div>
  );
}
