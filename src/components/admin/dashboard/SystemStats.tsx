'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { Users, Building, ShieldCheck, FileText } from 'lucide-react';

const StatCard = ({ icon, label, value, isLoading }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 flex items-center gap-5">
    <div className="bg-slate-100 p-3 rounded-full">
        {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      {isLoading ? (
        <div className="h-8 w-16 bg-slate-200 animate-pulse rounded-md mt-1"></div>
      ) : (
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      )}
    </div>
  </div>
);

export default function SystemStats() {
  const [stats, setStats] = useState({ companies: 0, renters: 0, verifications: 0, incidents: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [companiesSnap, rentersSnap, verificationsSnap, incidentsSnap] = await Promise.all([
          getDocs(collection(db, 'companies')),
          getDocs(collection(db, 'renters')),
          getDocs(collection(db, 'verifications')),
          getDocs(collection(db, 'incidents')),
        ]);
        setStats({
          companies: companiesSnap.size,
          renters: rentersSnap.size,
          verifications: verificationsSnap.size,
          incidents: incidentsSnap.size,
        });
      } catch (error) {
        console.error("Failed to fetch system stats:", error);
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  return (
    <section>
        <h2 className="text-xl font-semibold text-[#1A2540] mb-4">System Overview</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={<Building className="w-6 h-6 text-slate-500" />} label="Total Companies" value={stats.companies} isLoading={loading} />
            <StatCard icon={<Users className="w-6 h-6 text-slate-500" />} label="Total Renters" value={stats.renters} isLoading={loading} />
            <StatCard icon={<ShieldCheck className="w-6 h-6 text-slate-500" />} label="Total Verifications" value={stats.verifications} isLoading={loading} />
            <StatCard icon={<FileText className="w-6 h-6 text-slate-500" />} label="Total Incidents" value={stats.incidents} isLoading={loading} />
        </div>
    </section>
  );
}
