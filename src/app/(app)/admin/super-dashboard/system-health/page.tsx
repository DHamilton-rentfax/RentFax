'use client';

import { useEffect, useState } from 'react';
import { db } from '@/firebase/client';
import { collection, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function SystemHealthPage() {
  const [stats, setStats] = useState<any>({
    unresolvedDisputes: 0,
    overdueDisputes: 0,
    fraudAlerts: 0,
    chatOpen: 0,
    avgChatResponse: '—',
    firestoreOps: 0,
    loading: true,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        // Disputes still open or pending
        const disputesSnap = await getDocs(
          query(collection(db, 'disputes'), where('status', 'in', ['open', 'pending']))
        );

        const now = new Date().getTime();
        let overdueCount = 0;

        disputesSnap.forEach((doc) => {
          const d = doc.data();
          if (d.createdAt) {
            const createdAt = (d.createdAt as Timestamp).toDate().getTime();
            const ageDays = (now - createdAt) / (1000 * 60 * 60 * 24);
            if (ageDays > 7) {
              overdueCount++;
            }
          }
        });

        // Fraud alerts
        const fraudSnap = await getDocs(
          query(collection(db, 'renters'), where('alert', '==', true))
        );

        // Active chats
        const chatSnap = await getDocs(
          query(collection(db, 'chats'), where('status', '==', 'open'))
        );

        // Avg chat response time
        let responseTimes: number[] = [];
        for (const chat of chatSnap.docs) {
          const messagesRef = collection(db, `chats/${chat.id}/messages`);
          const messagesSnap = await getDocs(query(messagesRef, orderBy('createdAt', 'asc')));
          const messages = messagesSnap.docs.map((d) => d.data());

          const firstUserMsg = messages.find((m: any) => m.sender && !m.sender.includes('@'));
          const firstAdminMsg = messages.find((m: any) => m.sender && m.sender.includes('@'));

          if (firstUserMsg && firstAdminMsg && firstUserMsg.createdAt && firstAdminMsg.createdAt) {
            const userTime = (firstUserMsg.createdAt as Timestamp).toDate().getTime();
            const adminTime = (firstAdminMsg.createdAt as Timestamp).toDate().getTime();
            if (adminTime > userTime) {
              responseTimes.push(adminTime - userTime);
            }
          }
        }

        let avgResponse = '—';
        if (responseTimes.length > 0) {
          const avgMs = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
          avgResponse = formatDuration(avgMs);
        }

        // Firestore ops placeholder
        const firestoreOps = 12934;

        setStats({
          unresolvedDisputes: disputesSnap.size,
          overdueDisputes: overdueCount,
          fraudAlerts: fraudSnap.size,
          chatOpen: chatSnap.size,
          avgChatResponse: avgResponse,
          firestoreOps,
          loading: false,
        });
      } catch (err) {
        console.error('Error fetching system stats:', err);
        setStats((s: any) => ({ ...s, loading: false }));
      }
    }
    fetchStats();
  }, []);

  if (stats.loading) return <p className="p-6 text-gray-500">Loading system health...</p>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">System Health & Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          title="Unresolved Disputes" 
          value={stats.unresolvedDisputes} 
          desc="Open or pending disputes" 
          threshold={{ warning: 20, danger: 50 }} 
        />
        <MetricCard 
          title="Overdue Disputes (SLA)" 
          value={stats.overdueDisputes} 
          desc="Open > 7 days" 
          threshold={{ warning: 5, danger: 15 }} 
        />
        <MetricCard 
          title="Active Fraud Alerts" 
          value={stats.fraudAlerts} 
          desc="Flagged renters in system" 
          threshold={{ warning: 25, danger: 50 }} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          title="Active Chats" 
          value={stats.chatOpen} 
          desc="Support chats waiting" 
          threshold={{ warning: 5, danger: 15 }} 
        />
        <MetricCard 
          title="Avg Chat Response Time" 
          value={stats.avgChatResponse} 
          desc="Last 24 hours" 
        />
        <MetricCard 
          title="Firestore Operations" 
          value={stats.firestoreOps} 
          desc="Reads/Writes (today)" 
          threshold={{ warning: 20000, danger: 50000 }} 
        />
      </div>
    </div>
  );
}

function MetricCard({ 
  title, 
  value, 
  desc, 
  threshold 
}: { 
  title: string; 
  value: any; 
  desc: string; 
  threshold?: { warning: number; danger: number }; 
}) {
  let bg = "bg-white";
  let text = "text-gray-800";

  if (threshold && typeof value === "number") {
    if (value >= threshold.danger) {
      bg = "bg-red-100 border-red-500";
      text = "text-red-800";
    } else if (value >= threshold.warning) {
      bg = "bg-yellow-100 border-yellow-400";
      text = "text-yellow-800";
    }
  }

  return (
    <Card className={`${bg} border`}>
      <CardHeader><CardTitle className={text}>{title}</CardTitle></CardHeader>
      <CardContent>
        <p className={`text-3xl font-bold ${text}`}>{value}</p>
        <p className="text-sm text-gray-500">{desc}</p>
      </CardContent>
    </Card>
  );
}

function formatDuration(ms: number) {
  const sec = Math.floor(ms / 1000);
  const min = Math.floor(sec / 60);
  const s = sec % 60;
  if (min > 0) return `${min}m ${s}s`;
  return `${s}s`;
}
