"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "../ui/Card";

export default function VerificationStatsChart({ data }: { data: any[] }) {
  return (
    <Card>
      <h3 className="text-sm font-semibold mb-2 text-gray-700">
        Verification Trends
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <Line type="monotone" dataKey="verifications" stroke="#2563eb" strokeWidth={2} />
          <CartesianGrid stroke="#e5e7eb" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
