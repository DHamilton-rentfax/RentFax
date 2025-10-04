'use client';

import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function MetricCard({ title, value }: { title: string; value: number }) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-lg">{title}</CardTitle></CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{value}</p>
        </CardContent>
      </Card>
    );
  }

export default function DemoAnalytics() {
  const [events, setEvents] = useState<any[]>([]);
  const [stats, setStats] = useState({ renterClicks: 0, companyClicks: 0 });

  useEffect(() => {
    const q = query(
      collection(db, "demoAnalytics"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const list: any[] = [];
      let renterClicks = 0;
      let companyClicks = 0;

      snap.forEach((doc) => {
        const eventData = { id: doc.id, ...doc.data() };
        list.push(eventData);
        if (eventData.event === 'demo_role_selected') {
            if (eventData.data.role === 'RENTER') {
                renterClicks++;
            } else if (eventData.data.role === 'COMPANY') {
                companyClicks++;
            }
        }
      });
      setEvents(list.slice(0, 20)); // Keep only last 20 for display
      setStats({ renterClicks, companyClicks });
    });
    return () => unsub();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-6">
        <div>
            <h2 className="text-2xl font-bold mb-4">📊 Demo Usage Analytics</h2>
            <p className="text-sm text-gray-500 mb-4">
                Aggregated stats and live events from <code>demo.rentfax.io</code>
            </p>
        </div>

        {/* Aggregated Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard title="Renter Demo Clicks" value={stats.renterClicks} />
            <MetricCard title="Company Demo Clicks" value={stats.companyClicks} />
        </div>

      {/* Live Event Stream */}
      <div className="overflow-x-auto">
        <h3 className="text-lg font-semibold mb-2">Live Event Stream (Last 20)</h3>
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2">Event</th>
              <th className="px-4 py-2">Details</th>
              <th className="px-4 py-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{e.event}</td>
                <td className="px-4 py-2">
                  {e.data?.role ? e.data.role : JSON.stringify(e.data || {})}
                </td>
                <td className="px-4 py-2">
                  {e.createdAt?.toDate
                    ? e.createdAt.toDate().toLocaleString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
