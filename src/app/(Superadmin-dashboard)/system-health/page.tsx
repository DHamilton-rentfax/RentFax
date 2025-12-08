"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  Mail,
  MessageCircle,
  ServerCrash,
} from "lucide-react";

export default function SystemHealthPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/superadmin/system-health")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-gray-600">Loading system health…</p>;

  const ok = (status: string) =>
    status === "operational" ? (
      <span className="text-green-600 flex items-center gap-1">
        <CheckCircle2 className="h-4 w-4" /> Operational
      </span>
    ) : (
      <span className="text-red-600 flex items-center gap-1">
        <ServerCrash className="h-4 w-4" /> Degraded
      </span>
    );

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold mb-6">System Health</h1>

      {/* STATUS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Card
          title="Firestore Latency"
          icon={<Database className="h-5 w-5" />}
          value={`${data.firestoreLatency}ms`}
          status={data.firestoreLatency < 300 ? "operational" : "degraded"}
        />

        <Card
          title="Stripe Webhooks"
          icon={<AlertTriangle className="h-5 w-5" />}
          value={data.stripe.lastEvent ?? "No recent events"}
          status={data.stripe.status}
        />

        <Card
          title="Email Service"
          icon={<Mail className="h-5 w-5" />}
          status={data.email.status}
        />

        <Card
          title="SMS Service"
          icon={<MessageCircle className="h-5 w-5" />}
          status={data.sms.status}
        />
      </div>

      {/* ANOMALIES */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-xl font-semibold mb-3">Anomaly Detection</h2>

        {data.anomalies.searchSpike && (
          <Alert label="Search spike detected — possible abuse." />
        )}
        {data.anomalies.highFailureRate && (
          <Alert label="High verification failure rate — check identity service." />
        )}

        {!data.anomalies.searchSpike &&
          !data.anomalies.highFailureRate && (
            <p className="text-gray-600 text-sm">No anomalies detected.</p>
          )}
      </div>

      {/* LOGS */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-xl font-semibold mb-3">System Logs (Last 24h)</h2>

        <div className="space-y-4 max-h-[600px] overflow-auto">
          {data.recentLogs.map((log: any) => (
            <div key={log.id} className="p-4 border rounded-lg bg-gray-50">
              <p className="text-sm font-semibold">{log.type}</p>
              <p className="text-xs text-gray-600">{log.message}</p>
              <p className="text-[11px] text-gray-500 mt-1">
                {new Date(log.timestamp.seconds * 1000).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  icon,
  value,
  status,
}: {
  title: string;
  icon: React.ReactNode;
  value?: string;
  status: string;
}) {
  const color =
    status === "operational"
      ? "text-green-600"
      : "text-red-600";

  return (
    <div className="bg-white p-6 rounded-xl shadow border flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-medium">{title}</span>
      </div>

      {value && (
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      )}

      <p className={`text-sm font-medium ${color}`}>
        {status === "operational" ? "Operational" : "Degraded"}
      </p>
    </div>
  );
}

function Alert({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
      <AlertTriangle className="h-4 w-4" />
      {label}
    </div>
  );
}
