"use client";
import React, { useState, useEffect, Suspense } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RoleGate from "@/components/auth/RoleGate";

const generateMockAnalyticsData = () => ({
  revenue: Array.from({ length: 12 }, (_, i) => ({
    month: new Date(0, i).toLocaleString('default', { month: 'short' }),
    total: Math.floor(Math.random() * 5000) + 1000,
  })),
  signups: Array.from({ length: 12 }, (_, i) => ({
    month: new Date(0, i).toLocaleString('default', { month: 'short' }),
    count: Math.floor(Math.random() * 200) + 50,
  })),
});

function AnalyticsChart({ data, dataKey, title }: { data: any[], dataKey: string, title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={dataKey} fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<{ revenue: any[]; signups: any[] } | null>(null);
  const [timeframe, setTimeframe] = useState("90");

  useEffect(() => {
    setAnalyticsData(generateMockAnalyticsData());
  }, []);

  if (!analyticsData) {
    return <div>Loading analytics...</div>;
  }

  return (
    <RoleGate role="admin">
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
              <SelectItem value="365">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnalyticsChart data={analyticsData.revenue} dataKey="total" title="Revenue" />
          <AnalyticsChart data={analyticsData.signups} dataKey="count" title="User Signups" />
        </div>
      </div>
    </RoleGate>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AnalyticsPage />
    </Suspense>
  )
}
