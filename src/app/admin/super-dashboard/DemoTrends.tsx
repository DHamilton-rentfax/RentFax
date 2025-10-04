"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";

export default function DemoTrends({ data }: { data: any[] }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold mb-4">📊 Demo Funnel Trends (last 90 days)</h2>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="visits" stroke="#8884d8" strokeWidth={2} />
          <Line type="monotone" dataKey="conversions" stroke="#82ca9d" strokeWidth={2} />
          <Line type="monotone" dataKey="trials" stroke="#ffc658" strokeWidth={2} />
          <Line type="monotone" dataKey="paid" stroke="#ff7300" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
