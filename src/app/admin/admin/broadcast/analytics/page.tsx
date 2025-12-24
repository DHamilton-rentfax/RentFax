'use client';

import { useEffect, useState } from 'react';
import { Loader2, Users, BarChart3, Download, RefreshCcw } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { toast } from 'react-hot-toast';

import { Card, CardContent } from '@/components/ui/card';

interface BroadcastMetric {
  id: string;
  message: string;
  audience: string;
  sentAt: string;
  reads: number;
  totalDelivered: number;
  readRate: number;
}

interface SegmentRate {
  role: string;
  reads: number;
  total: number;
  readRate: number;
}

export default function BroadcastAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<BroadcastMetric[]>([]);
  const [segments, setSegments] = useState<SegmentRate[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/admin/broadcast/analytics');
      const data = await res.json();
      setMetrics(data.metrics || []);
      setSegments(data.segmentedRates || []);
      setLoading(false);
    })();
  }, []);

  async function handleExport() {
    try {
      const res = await fetch('/api/admin/broadcast/export');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'broadcast_analytics.csv';
      a.click();
      toast.success('Exported analytics to CSV!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to export CSV');
    }
  }

  async function handleRebroadcast(messageId: string) {
    try {
      const res = await fetch('/api/admin/broadcast/rebroadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Rebroadcasted to ${data.sentCount} unread users.`);
      } else {
        toast.error(data.message || 'Rebroadcast failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Rebroadcast error');
    }
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center h-[70vh]'>
        <Loader2 className='animate-spin h-8 w-8 text-blue-600' />
      </div>
    );
  }

  const avgRead = (
    metrics.reduce((sum, m) => sum + m.readRate, 0) /
    (metrics.length || 1)
  ).toFixed(1);

  return (
    <main className='p-6 bg-gray-50 min-h-screen'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold text-[#1A2540]'>Broadcast Analytics</h1>
        <div className='flex gap-3'>
          <button
            onClick={handleExport}
            className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition'
          >
            <Download className='h-4 w-4' /> Export CSV
          </button>
        </div>
      </div>

      {/* Overall KPIs */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center gap-3'>
              <Users className='text-blue-600' />
              <div>
                <p className='text-sm text-gray-500'>Total Broadcasts Sent</p>
                <h2 className='text-2xl font-semibold'>
                  {metrics.length.toLocaleString()}
                </h2>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center gap-3'>
              <BarChart3 className='text-green-600' />
              <div>
                <p className='text-sm text-gray-500'>Avg Read Rate</p>
                <h2 className='text-2xl font-semibold'>{avgRead}%</h2>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Segmentation */}
      <div className='bg-white shadow rounded-lg p-6 mb-8'>
        <h2 className='text-xl font-semibold mb-4'>Engagement by Role</h2>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={segments}>
            <XAxis dataKey='role' />
            <YAxis />
            <Tooltip formatter={(val: number) => `${val.toFixed(1)}%`} />
            <Legend />
            <Bar dataKey='readRate' fill='#3b82f6' name='Read Rate (%)' />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Per Message Breakdown */}
      <div className='bg-white shadow rounded-lg p-6'>
        <h2 className='text-xl font-semibold mb-4'>Recent Broadcasts</h2>
        <ResponsiveContainer width='100%' height={350}>
          <BarChart data={metrics}>
            <XAxis dataKey='message' hide />
            <YAxis />
            <Tooltip
              formatter={(value: number) => `${value.toFixed(1)}%`}
              labelFormatter={(label) =>
                metrics.find((m) => m.message === label)?.message
              }
            />
            <Bar dataKey='readRate' fill='#2563eb' name='Read Rate (%)' />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className='mt-6'>
        <h3 className='text-lg font-semibold mb-3'>Rebroadcast Actions</h3>
        <div className='space-y-2'>
          {metrics.map((m) => (
            <div
              key={m.id}
              className='flex justify-between bg-gray-50 border rounded-md p-3'
            >
              <span className='truncate max-w-xs'>{m.message}</span>
              <button
                onClick={() => handleRebroadcast(m.id)}
                className='flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700'
              >
                <RefreshCcw className='h-4 w-4' /> Re-broadcast
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
