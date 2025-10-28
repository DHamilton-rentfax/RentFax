"use client";

import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "../ui/Card";

export default function PlanUsageChart({ data }: { data: any[] }) {
  return (
    <Card>
      <h3 className="text-sm font-semibold mb-2 text-gray-700">Plan Usage</h3>
      <ResponsiveContainer width="100%" height={240}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="20%"
          outerRadius="90%"
          barSize={10}
          data={data}
        >
          <RadialBar
            minAngle={15}
            background
            clockWise
            dataKey="usage"
            fill="#2563eb"
          />
          <Legend iconSize={8} layout="vertical" verticalAlign="middle" />
        </RadialBarChart>
      </ResponsiveContainer>
    </Card>
  );
}
