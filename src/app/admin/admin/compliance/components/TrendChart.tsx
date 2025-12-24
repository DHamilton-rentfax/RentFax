'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TrendChart({ trends }: { trends: any[] }) {
  if (!trends.length)
    return <p className="text-gray-600 text-center">No compliance data yet.</p>;

  const chartData = trends.map((t) => ({
    date: new Date(t.date).toLocaleDateString(),
    complianceRate: t.complianceRate,
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border">
      <h2 className="text-xl font-bold text-[#1A2540] mb-4">Compliance Trends Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Line type="monotone" dataKey="complianceRate" stroke="#1A2540" strokeWidth={3} dot={true} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
