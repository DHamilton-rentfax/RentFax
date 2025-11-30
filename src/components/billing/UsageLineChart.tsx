"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function UsageLineChart({ data }: any) {
  return (
    <div className="w-full h-64 bg-white p-4 rounded-xl shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line dataKey="searches" stroke="#1A2540" strokeWidth={2} />
          <Line dataKey="reports" stroke="#7B8AB8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
