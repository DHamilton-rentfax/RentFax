"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", risk: 75 },
  { name: "Feb", risk: 78 },
  { name: "Mar", risk: 80 },
  { name: "Apr", risk: 82 },
  { name: "May", risk: 85 },
  { name: "Jun", risk: 88 },
];

export default function DemoChart() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
      <h3 className="text-lg font-semibold mb-4">Risk Trend (Demo Data)</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="name" stroke="#888" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="risk" stroke="#059669" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
