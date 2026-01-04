'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Activity, Layers, FileText, AlertTriangle } from 'lucide-react';

import { db } from '@/firebase/client';
import { useAuth } from '@/hooks/use-auth';

export default function AnalyticsPage() {
  const { company } = useAuth();
  const [assets, setAssets] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!company?.id) return;
    const loadData = async () => {
      const assetSnap = await getDocs(query(collection(db, 'assets'), where('companyId', '==', company.id)));
      const reportSnap = await getDocs(query(collection(db, 'reports'), where('companyId', '==', company.id)));

      setAssets(assetSnap.docs.map((d) => d.data()));
      setReports(reportSnap.docs.map((d) => d.data()));
      setLoading(false);
    };
    loadData();
  }, [company]);

  if (loading) return <div className="p-6 text-gray-600">Loading analytics...</div>;

  const activeAssets = assets.filter((a) => a.status === 'active').length;
  const archivedAssets = assets.filter((a) => a.status === 'archived').length;
  const totalReports = reports.length;

  const reportTypes = reports.reduce((acc: any, r: any) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {});

  const typeData = Object.keys(reportTypes).map((key) => ({
    name: key,
    value: reportTypes[key],
  }));

  const COLORS = ['#2563EB', '#F59E0B', '#10B981', '#EF4444'];

  const assetTypeCount = assets.reduce((acc: any, a: any) => {
    acc[a.type] = (acc[a.type] || 0) + 1;
    return acc;
  }, {});

  const assetTypeData = Object.keys(assetTypeCount).map((k) => ({ name: k, count: assetTypeCount[k] }));

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Analytics Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <SummaryCard icon={<Layers />} title="Total Assets" value={assets.length} />
        <SummaryCard icon={<Activity />} title="Active Assets" value={activeAssets} />
        <SummaryCard icon={<FileText />} title="Total Reports" value={totalReports} />
        <SummaryCard icon={<AlertTriangle />} title="Archived" value={archivedAssets} />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Asset Type Distribution */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Assets by Type</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={assetTypeData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563EB" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Report Type Distribution */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Report Type Breakdown</h2>
          {typeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={typeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-500">No reports yet.</p>
          )}
        </div>
      </div>

      {/* Future placeholder for QR scan tracking */}
      <div className="bg-white rounded-xl p-6 mt-10 shadow text-center">
        <p className="text-sm text-gray-500">
          📈 Coming Soon: QR scan analytics, renter behavior insights, and AI-driven risk patterns.
        </p>
      </div>
    </div>
  );
}

function SummaryCard({ icon, title, value }: any) {
  return (
    <div className="bg-white shadow rounded-xl p-4 flex items-center gap-4">
      <div className="text-blue-600 bg-blue-50 p-3 rounded-lg">{icon}</div>
      <div>
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
