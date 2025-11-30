'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { format, formatDistanceToNow } from 'date-fns';
import { CheckCircle, AlertCircle, Clock, User, MessageSquare } from 'lucide-react';

import { db } from '@/firebase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TimelineEvent {
  id: string;
  action: string;
  actorId: string;
  message: string;
  createdAt: any; // Firestore timestamp
}

const eventIcons: { [key: string]: JSX.Element } = {
  INCIDENT_CREATED: <AlertCircle className="w-5 h-5 text-red-500" />,
  PAYMENT_RECORDED: <CheckCircle className="w-5 h-5 text-green-500" />,
  NOTE_ADDED: <MessageSquare className="w-5 h-5 text-blue-500" />,
  STATUS_CHANGED: <Clock className="w-5 h-5 text-gray-500" />,
  DEFAULT: <User className="w-5 h-5 text-gray-400" />,
};

export function IncidentTimeline({ incidentId }: { incidentId: string }) {
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!incidentId) return;

    const q = query(
      collection(db, 'timeline'),
      where('incidentId', '==', incidentId),
      orderBy('createdAt', 'desc'),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const events: TimelineEvent[] = [];
      snapshot.forEach(doc => {
        events.push({ id: doc.id, ...doc.data() } as TimelineEvent);
      });
      setTimeline(events);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [incidentId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incident Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        {timeline.length === 0 ? (
          <p className="text-muted-foreground">No events yet.</p>
        ) : (
          <div className="space-y-6">
            {timeline.map((event) => (
              <div key={event.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                    <span className="flex items-center justify-center w-10 h-10 bg-muted rounded-full">
                        {eventIcons[event.action] || eventIcons.DEFAULT}
                    </span>
                    <div className="flex-grow w-px bg-muted my-2"></div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-medium">
                      {event.action.replace(/_/, ' ').toLowerCase()}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(event.createdAt.toDate(), { addSuffix: true })}
                    </p>
                  </div>
                  <p className="mt-1 text-sm">{event.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    By: {event.actorId}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
