'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';

import { db } from '@/firebase/client';

import ComplianceChart from './components/ComplianceChart';
import ComplianceTable from './components/ComplianceTable';
import ExportButton from './components/ExportButton';

export default function ComplianceCenterPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const snap = await getDocs(collection(db, 'globalBanners'));
      const items = [];

      for (const docSnap of snap.docs) {
        const banner = { id: docSnap.id, ...docSnap.data(), acknowledgments: [] };
        const ackSnap = await getDocs(collection(db, 'globalBanners', docSnap.id, 'acknowledgments'));
        banner.acknowledgments = ackSnap.docs.map((a) => a.data());
        items.push(banner);
      }

      setData(items);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <p className="p-6 text-gray-600">Loading compliance data...</p>;

  const totalBanners = data.length;
  const totalAck = data.reduce((sum, b) => sum + (b.acknowledgments?.length || 0), 0);
  const avgAckRate = totalBanners ? Math.round(totalAck / totalBanners) : 0;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-[#1A2540] mb-6">Compliance Center</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-4 text-center border">
          <h2 className="text-lg font-semibold">Active Policies</h2>
          <p className="text-3xl font-bold text-[#1A2540]">{totalBanners}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center border">
          <h2 className="text-lg font-semibold">Total Acknowledgments</h2>
          <p className="text-3xl font-bold text-green-600">{totalAck}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center border">
          <h2 className="text-lg font-semibold">Avg. Acknowledgments per Policy</h2>
          <p className="text-3xl font-bold text-blue-600">{avgAckRate}</p>
        </div>
      </div>

      <ComplianceChart banners={data} />
      <ComplianceTable banners={data} />
      <ExportButton banners={data} />
    </div>
  );
}
