import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function InsightsPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState<string | null>(null);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      const res = await fetch("/api/admin/departments/insights");
      const data = await res.json();
      setInsights(data.insights || []);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const regenerate = async (deptId: string) => {
    if (!token) return;
    setRegenerating(deptId);
    try {
      const res = await fetch(`/api/admin/departments/${deptId}/insights`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast({ title: "Insight Regenerated", description: data.summary });
      loadInsights();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setRegenerating(null);
    }
  };

  const renderTrend = (current: number, previous: number | undefined) => {
    if (previous === undefined) return <span>—</span>;
    const delta = current - previous;
    const percent = ((delta / (previous || 1)) * 100).toFixed(1);
    const positive = delta >= 0;
    return (
      <span className={`flex items-center text-sm ${positive ? "text-green-600" : "text-red-600"}`}>
        {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {Math.abs(percent)}%
      </span>
    );
  };

  if (loading) return <p>Loading insights...</p>;

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">AI Department Insights</h1>
        <Button variant="outline" onClick={loadInsights}>
          Refresh
        </Button>
      </header>

      {insights.length === 0 ? (
        <p className="text-muted-foreground">No AI summaries available yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.map((i) => {
            const prev = i.previousMetrics || {};
            const curr = i.metrics || {};
            return (
              <Card key={i.id} className="border shadow-sm hover:shadow-md transition-all">
                <CardHeader>
                  <CardTitle>{i.id}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-2">
                    Week of {i.weekStart}
                  </p>
                  <p className="text-sm mb-3">{i.summary}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Users</p>
                      <div className="flex justify-between">
                        <p>{curr.totalUsers ?? "—"}</p>
                        {renderTrend(curr.totalUsers, prev.totalUsers)}
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Incidents</p>
                      <div className="flex justify-between">
                        <p>{curr.totalIncidents ?? "—"}</p>
                        {renderTrend(curr.totalIncidents, prev.totalIncidents)}
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Disputes</p>
                      <div className="flex justify-between">
                        <p>{curr.totalDisputes ?? "—"}</p>
                        {renderTrend(curr.totalDisputes, prev.totalDisputes)}
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Fraud Alerts</p>
                      <div className="flex justify-between">
                        <p>{curr.fraudAlerts ?? "—"}</p>
                        {renderTrend(curr.fraudAlerts, prev.fraudAlerts)}
                      </div>
                    </div>
                  </div>
                  {i.aiRecommendation && (
                    <div className="mt-3 border-t pt-2 text-xs">
                      <p className="font-medium">Recommendation:</p>
                      <p className="text-muted-foreground">{i.aiRecommendation}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <Link href={`/admin/departments/${i.id}`}>
                    <Button size="sm" variant="outline">
                      View Department
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    disabled={regenerating === i.id}
                    onClick={() => regenerate(i.id)}
                  >
                    {regenerating === i.id ? "Generating..." : "Regenerate"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
