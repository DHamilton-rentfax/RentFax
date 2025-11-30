'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ReputationBar from "@/components/renter/ReputationBar";

export default function RenterDetailPage() {
  const [renter, setRenter] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const subRes = await fetch("/api/landlord/subscription");
      const subData = await subRes.json();
      setSubscription(subData);

      if (subData.plan === "free") {
        router.push("/landlord/subscription");
        return;
      }

      if (!params.renterId) return;
      const res = await fetch(`/api/landlord/renters/${params.renterId}`);
      const data = await res.json();
      setRenter(data);
      setLoading(false);
    }
    load();
  }, [params.renterId, router]);

  if (loading || !subscription || !renter) return <p>Loading renter details...</p>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <Link href="/landlord/search" className="text-blue-600 hover:underline">← Back to Search</Link>
          <h1 className="text-3xl font-bold mt-2">{renter.name}'s Report</h1>
        </div>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">Export to PDF</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">AI Risk Summary</h2>
            <p className="text-gray-700">{renter.aiExplanation}</p>
          </div>

          <div className="bg-white border rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Incident History</h2>
            {renter.incidentHistory.length > 0 ? (
              <ul className="space-y-4">
                {renter.incidentHistory.map((item) => (
                  <li key={item.id} className="border-b pb-2">
                    <p className="font-semibold">{item.description}</p>
                    <p className="text-sm text-gray-500">{item.date}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No incidents reported.</p>
            )}
          </div>

          {renter.fraudSignals.length > 0 && (
            <div className="bg-red-50 border-red-200 border rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-red-700">Fraud Signals Detected</h2>
              <ul className="space-y-2">
                {renter.fraudSignals.map((signal, index) => (
                  <li key={index} className="text-red-600">
                    - {signal}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-white border rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Dispute Summary</h2>
            {renter.disputeSummary.length > 0 ? (
              <ul className="space-y-4">
                {renter.disputeSummary.map((item) => (
                  <li key={item.id} className="border-b pb-2">
                    <p className="font-semibold">{item.description}</p>
                    <p className="text-sm text-gray-500">{item.date}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No disputes filed.</p>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white border rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Reputation</h2>
            <ReputationBar score={renter.score} level={renter.level} xp={renter.xp} />
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p><strong>Identity:</strong> {renter.identityStatus}</p>
              <p><strong>Address:</strong> {renter.addressVerification}</p>
            </div>
          </div>
          <div className="bg-white border rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Behavior</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>On-Time Payments:</strong> {renter.paymentBehavior.onTimePayments}</p>
              <p><strong>Late Payments:</strong> {renter.paymentBehavior.latePayments}</p>
              <p><strong>Avg. Delay:</strong> {renter.paymentBehavior.averageDelay} days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
