
"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import {
  Activity,
  DollarSign,
  Users,
  CheckSquare,
} from "lucide-react";
import { db } from "@/firebase/client";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

function SalesStatCard({ title, value, subtext, icon, trend }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{subtext}</p>
        {trend && (
          <div className="mt-2">
            <Progress value={trend.value} />
            <p className="text-xs text-muted-foreground mt-1">{trend.label}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RecentActivityList() {
  const activities = [
    { type: "Call", contact: "John @ Ace Rentals", time: "2h ago" },
    { type: "Email", contact: "Proposal Sent to Urban Living", time: "4h ago" },
    { type: "Lead", contact: "Assigned high-value lead from ToolCity", time: "1d ago" },
    { type: "Meeting", contact: "Demo completed with Mike", time: "2d ago" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>A summary of your latest sales actions.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((act, index) => (
            <div key={index} className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                <Activity className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{act.type}</p>
                <p className="text-sm text-muted-foreground">{act.contact}</p>
              </div>
              <div className="ml-auto font-medium text-xs text-muted-foreground">
                {act.time}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function SalesDashboardPage() {
  const [deals, setDeals] = useState<any[]>([]);

  useEffect(() => {
    const unsubDeals = onSnapshot(collection(db, "deals"), snap =>
      setDeals(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );
    return () => unsubDeals();
  }, []);

  const pipelineValue = deals.reduce((t, d) => t + (d.amountMonthly || 0), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Sales Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SalesStatCard
          title="Pipeline Value"
          value={`$${pipelineValue.toLocaleString()}`}
          subtext="+20.1% from last month"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <SalesStatCard
          title="Deals This Month"
          value="14"
          subtext="+10 since last month"
          icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
        />
        <SalesStatCard
          title="Tasks Due Today"
          value="6"
          subtext="2 overdue"
          icon={<CheckSquare className="h-4 w-4 text-muted-foreground" />}
        />
        <SalesStatCard
          title="Your Commission (Projected)"
          value="$3,420"
          subtext="Based on current pipeline"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <RecentActivityList />
    </div>
  );
}
