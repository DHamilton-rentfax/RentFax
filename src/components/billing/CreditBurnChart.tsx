"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function CreditBurnChart({ daily }: any) {
  return (
    <div className="w-full h-64 bg-white p-4 rounded-xl shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={daily}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="searches" fill="#1A2540" />
          <Bar dataKey="reports" fill="#7B8AB8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
