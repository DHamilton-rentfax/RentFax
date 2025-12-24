'use client';

import { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Loader2, Send, Clock } from 'lucide-react';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: 'sent' | 'scheduled';
  audience: string;
}

const eventStyleGetter = (event: CalendarEvent) => {
  const style = {
    backgroundColor:
      event.status === 'sent' ? '#2563eb' : '#f59e0b', // Blue for sent, Amber for scheduled
    borderRadius: '5px',
    opacity: 0.8,
    color: 'white',
    border: '0px',
    display: 'block',
  };
  return { style };
};

const CustomEvent = ({ event }: { event: CalendarEvent }) => (
  <div className='flex items-center gap-2'>
    {event.status === 'sent' ? (
      <Send className='h-4 w-4' />
    ) : (
      <Clock className='h-4 w-4' />
    )}
    <span className='truncate'>{event.title}</span>
  </div>
);

export default function BroadcastSchedulerPage() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/admin/broadcast/schedule');
      const data = await res.json();

      const formattedEvents = (data.events || []).map((e: any) => ({
        ...e,
        start: new Date(e.start),
        end: new Date(e.end),
      }));

      setEvents(formattedEvents);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className='flex justify-center items-center h-[70vh]'>
        <Loader2 className='animate-spin h-8 w-8 text-blue-600' />
      </div>
    );
  }

  return (
    <main className='p-6 bg-white min-h-screen'>
      <h1 className='text-3xl font-bold text-[#1A2540] mb-6'>
        Broadcast Scheduler
      </h1>
      <div className='h-[80vh]'>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor='start'
          endAccessor='end'
          style={{ height: '100%' }}
          eventPropGetter={eventStyleGetter}
          components={{
            event: CustomEvent,
          }}
          tooltipAccessor={(event: CalendarEvent) =>
            `${event.title} (${
              event.status === 'sent' ? 'Sent' : 'Scheduled'
            } to ${event.audience})`
          }
        />
      </div>
    </main>
  );
}
