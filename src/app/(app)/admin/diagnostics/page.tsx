'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import toast from "react-hot-toast";

interface DiagnosticResult {
  firebase: string;
  stripe: string;
  env: string;
  region: string;
  time: string;
}

export default function AdminDiagnosticsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DiagnosticResult | null>(null);

  const runDiagnostics = async () => {
    if (!user) {
      toast.error("Please log in as Super Admin first.");
      return;
    }

    setLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/debug-env", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error(`Server responded ${res.status}`);
      }

      const data = await res.json();
      setResults({
        firebase: data.firebaseAdmin || "❌ Missing",
        stripe: data.stripeSecret || "❌ Missing",
        env: data.env || "Unknown",
        region: data.region || "n/a",
        time: data.time || new Date().toISOString(),
      });

      toast.success("Diagnostics complete.");
    } catch (err) {
      console.error(err);
      toast.error("Diagnostics failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const StatusIcon = ({ ok }: { ok: boolean }) =>
    ok ? (
      <CheckCircle2 className="text-green-500 w-5 h-5" />
    ) : (
      <XCircle className="text-red-500 w-5 h-5" />
    );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">System Diagnostics</h1>

      <Card className="p-6 border bg-white shadow-sm rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Environment Health
          </h2>
          <Button
            onClick={runDiagnostics}
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Checking...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" /> Re-run
              </>
            )}
          </Button>
        </div>

        {!results ? (
          <p className="text-gray-500">Running checks...</p>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Firebase Admin</span>
              <div className="flex items-center gap-2">
                <StatusIcon ok={results.firebase.includes("✅")} />
                <span className="text-sm">{results.firebase}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700">Stripe Secret</span>
              <div className="flex items-center gap-2">
                <StatusIcon ok={results.stripe.includes("✅")} />
                <span className="text-sm">{results.stripe}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700">Environment</span>
              <span className="text-sm text-gray-600">{results.env}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700">Region</span>
              <span className="text-sm text-gray-600">{results.region}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700">Timestamp</span>
              <span className="text-sm text-gray-600">{results.time}</span>
            </div>
          </div>
        )}
      </Card>

      <p className="text-xs text-gray-400 mt-4">
        Only Super Admins can access this page. It safely tests connectivity to
        Firebase, Stripe, and environment variables without exposing secrets.
      </p>
    </div>
  );
}
