'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

interface MetricEntry {
  id: string;
  metrics: {
    totalUsers: number;
    totalIncidents: number;
    totalDisputes: number;
    fraudAlerts: number;
  };
  summary: string;
  aiRecommendation?: string;
  trendSummary?: string;
  performanceGrade?: string;
}

export default function DepartmentTimeline() {
  const { toast } = useToast();
  const params = useParams();
  const deptId = (params?.id as string) || "";
  const [history, setHistory] = useState<MetricEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const loadInsights = () => {
    setLoading(true);
    fetch(`/api/admin/departments/${deptId}/history`)
      .then((r) => r.json())
      .then((d) => setHistory(d.history || []))
      .catch((err) => {
        console.error(err);
        toast({ title: "Error", description: "Failed to load department data", variant: "destructive" });
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadInsights();
  }, [deptId]);

  const analyzeTrends = async (deptId: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/departments/${deptId}/analyze-trends`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast({ title: "Trend Analysis Complete", description: data.summary });
      loadInsights();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  if (loading) return <p>Loading performance timeline...</p>;

  const chartData = history
    .map((h) => ({
      week: h.id,
      users: h.metrics.totalUsers,
      incidents: h.metrics.totalIncidents,
      disputes: h.metrics.totalDisputes,
      fraud: h.metrics.fraudAlerts,
    }))
    .reverse(); // oldest to newest

  const latestInsight = history[0] || {};

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={loadInsights}>Regenerate</Button>
        <Button variant="outline" size="sm" onClick={() => analyzeTrends(deptId)}>Analyze Trends</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Performance Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <p className="text-muted-foreground">No historical data available yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData}>
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#22c55e" name="Users" />
                <Line type="monotone" dataKey="incidents" stroke="#f97316" name="Incidents" />
                <Line type="monotone" dataKey="disputes" stroke="#3b82f6" name="Disputes" />
                <Line type="monotone" dataKey="fraud" stroke="#ef4444" name="Fraud Alerts" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {(latestInsight as any).trendSummary && (
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>AI Trend Commentary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">{latestInsight.trendSummary}</p>
            {latestInsight.performanceGrade && (
              <div className="flex items-center space-x-2 mt-1">
                <p className="font-semibold">Performance Grade:</p>
                <span
                  className={`px-2 py-1 rounded text-white text-xs font-medium ${
                    latestInsight.performanceGrade === "A"
                      ? "bg-green-600"
                      : latestInsight.performanceGrade === "B"
                      ? "bg-emerald-500"
                      : latestInsight.performanceGrade === "C"
                      ? "bg-yellow-500"
                      : latestInsight.performanceGrade === "D"
                      ? "bg-orange-500"
                      : "bg-red-600"
                  }`}
                >
                  {latestInsight.performanceGrade}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            {history.slice(0, 3).map((h) => (
              <div key={h.id} className="border-b pb-3 mb-3">
                <p className="text-sm font-medium mb-1">{h.id}</p>
                <p className="text-sm text-muted-foreground">{h.summary}</p>
                {h.aiRecommendation && (
                  <p className="text-xs text-green-600 mt-1">{h.aiRecommendation}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
