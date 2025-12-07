"use client";

import {
  LineChart, Line,
  PieChart, Pie,
  Tooltip,
  XAxis, YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function ChartPanel({ data }) {
  const monthly = buildMonthly(data);
  const riskDist = buildRiskDistribution(data);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="p-6 bg-white border rounded-lg shadow">
        <h2 className="text-xl font-bold mb-3">Monthly Report Volume</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#C8A044" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="p-6 bg-white border rounded-lg shadow">
        <h2 className="text-xl font-bold mb-3">Risk Distribution</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={riskDist} dataKey="value" nameKey="label" outerRadius={80} fill="#C8A044" label />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function buildMonthly(data) {
  const months: Record<string, number> = {};
  data.forEach((d) => {
    const m = new Date(d.createdAt).toLocaleString("default", { month: "short" });
    months[m] = (months[m] || 0) + 1;
  });

  return Object.entries(months).map(([month, count]) => ({ month, count }));
}

function buildRiskDistribution(data) {
  const low = data.filter((d) => d.riskScore >= 0 && d.riskScore <= 33).length;
  const med = data.filter((d) => d.riskScore > 33 && d.riskScore <= 66).length;
  const high = data.filter((d) => d.riskScore > 66).length;

  return [
    { label: "Low", value: low },
    { label: "Medium", value: med },
    { label: "High", value: high },
  ];
}
