'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ComplianceChart({ banners }: { banners: any[] }) {
  const chartData = banners.map((b) => ({
    name: b.title.slice(0, 20) + (b.title.length > 20 ? '...' : ''),
    acknowledgments: b.acknowledgments?.length || 0,
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border mb-8">
      <h2 className="text-xl font-bold mb-4 text-[#1A2540]">Acknowledgments per Policy</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-20} textAnchor="end" height={60} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="acknowledgments" fill="#1A2540" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
