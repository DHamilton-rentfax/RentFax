'use client';
import { useEffect, useState } from 'react';
import { Car, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Rental, Incident } from '@/lib/mock-data';
import { Skeleton } from './ui/skeleton';

interface TimelineItem {
  type: 'rental' | 'incident';
  date: string;
  data: Rental | Incident;
}

export default function RenterTimeline({ renterId }: { renterId: string }) {
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch rentals and incidents for the renterId
    fetch(`/api/mock-data?type=all`)
      .then((res) => res.json())
      .then((data) => {
        const renterRentals = data.rentals.filter(
          (r: Rental) => r.renterId === renterId
        );
        const rentalIds = renterRentals.map((r: Rental) => r.id);
        const renterIncidents = data.incidents.filter((i: Incident) =>
          rentalIds.includes(i.rentalId)
        );

        const rentalItems: TimelineItem[] = renterRentals.map((r: Rental) => ({
          type: 'rental',
          date: r.startAt,
          data: r,
        }));

        const incidentItems: TimelineItem[] = renterIncidents.map(
          (i: Incident) => ({
            type: 'incident',
            date: i.date,
            data: i,
          })
        );

        const combined = [...rentalItems, ...incidentItems].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setTimeline(combined);
        setLoading(false);
      });
  }, [renterId]);

  const renderIcon = (type: 'rental' | 'incident', itemData: any) => {
    if (type === 'rental') {
      return <Car className="h-5 w-5 text-primary" />;
    }
    const incidentType = (itemData as Incident).type;
    switch(incidentType) {
        case 'Damage': return <AlertTriangle className="h-5 w-5 text-destructive" />;
        case 'Late Return': return <Clock className="h-5 w-5 text-yellow-500" />;
        default: return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  }

  if (loading) {
    return (
        <Card>
            <CardHeader><CardTitle>Activity Timeline</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                {Array.from({length: 3}).map((_, i) => (
                     <div key={i} className="flex gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                             <Skeleton className="h-4 w-1/4" />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        {timeline.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
                <p>No activity recorded for this renter.</p>
            </div>
        ) : (
        <div className="relative pl-6 after:absolute after:inset-y-0 after:w-px after:bg-border after:left-0">
          {timeline.map((item, index) => (
            <div key={index} className="relative grid grid-cols-[auto_1fr] gap-x-4 mb-6">
              <div className="absolute left-[-24px] top-1 flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                {renderIcon(item.type, item.data)}
              </div>
              <div className="col-start-2 space-y-1">
                <div className="text-sm font-medium">
                  {item.type === 'rental' ? 'New Rental' : 'Incident Reported'} - <span className="text-muted-foreground text-xs">{new Date(item.date).toLocaleDateString()}</span>
                </div>
                 {item.type === 'rental' ? (
                     <div className="text-sm text-muted-foreground">
                        <p><strong>Vehicle:</strong> {(item.data as Rental).vehicle}</p>
                        <p><strong>Duration:</strong> {new Date((item.data as Rental).startAt).toLocaleDateString()} to {new Date((item.data as Rental).endAt).toLocaleDateString()}</p>
                     </div>
                 ) : (
                    <div className="text-sm text-muted-foreground">
                        <p><strong>Type:</strong> <span className="font-semibold text-foreground">{(item.data as Incident).type}</span></p>
                        <p><strong>Description:</strong> {(item.data as Incident).description}</p>
                        <p><strong>Amount:</strong> ${(item.data as Incident).amount.toFixed(2)}</p>
                    </div>
                 )}
              </div>
            </div>
          ))}
        </div>
        )}
      </CardContent>
    </Card>
  );
}
