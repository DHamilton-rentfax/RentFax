"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/client";

import { useAuth } from "@/hooks/use-auth";

import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function RenterDisputeDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const { user, loading: authLoading } = useAuth();
  const [dispute, setDispute] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    // Ensure we have a valid ID before fetching
    if (typeof id !== 'string' || !id) {
        setLoading(false);
        return;
    }

    const load = async () => {
      setLoading(true);

      const snap = await getDoc(doc(db, "disputes", id));
      if (!snap.exists()) {
        setDispute(null);
        setLoading(false);
        return;
      }

      const data = { id, ...snap.data() };
      // Optional: enforce that this dispute belongs to this renter
      if (data.renterId && data.renterId !== user.uid) {
        setDispute(null);
      } else {
        setDispute(data);
      }

      setLoading(false);
    };

    load();
  }, [id, authLoading, user]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 text-gray-600">
        Please sign in to view this dispute.
      </div>
    );
  }

  if (!dispute) {
    return (
      <div className="text-center py-20 text-gray-500">
        Dispute not found.
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <Card className="p-6 space-y-2">
        <h1 className="text-2xl font-bold text-[#1A2540]">
          Dispute Details
        </h1>

        <p className="text-gray-700">
          Incident:{" "}
          {dispute.incidentId ? (
            <Link
              href={`/incidents/${dispute.incidentId}`}
              className="text-blue-600 hover:underline"
            >
              View incident
            </Link>
          ) : (
            "—"
          )}
        </p>

        <p className="text-gray-700">
          Company:{" "}
          <span className="font-medium">
            {dispute.companyName ?? "—"}
          </span>
        </p>

        <p className="text-gray-700">
          Amount in question:{" "}
          <span className="font-semibold">
            {dispute.amount ? `$${dispute.amount}` : "—"}
          </span>
        </p>

        <p className="text-sm text-gray-500">
          Status:{" "}
          <span
            className={`font-semibold capitalize ${
              dispute.status === "resolved"
                ? "text-green-600"
                : dispute.status === "pending"
                ? "text-yellow-600"
                : dispute.status === "review"
                ? "text-blue-600"
                : "text-red-600"
            }`}
          >
            {dispute.status ?? "unknown"}
          </span>
        </p>

        <p className="text-sm text-gray-500">
          Submitted:{" "}
          {dispute.createdAt?.seconds
            ? new Date(
                dispute.createdAt.seconds * 1000
              ).toLocaleDateString()
            : "—"}
        </p>
      </Card>

      <Card className="p-6 space-y-3">
        <h3 className="font-semibold text-lg">What you told us</h3>
        <p className="text-gray-700 whitespace-pre-wrap">
          {dispute.description ?? "No description provided."}
        </p>
      </Card>

      {dispute.adminNotes && (
        <Card className="p-6 space-y-3 bg-slate-50">
          <h3 className="font-semibold text-lg">Review Notes</h3>
          <p className="text-gray-700 whitespace-pre-wrap">
            {dispute.adminNotes}
          </p>
        </Card>
      )}

      {dispute.evidence && dispute.evidence.length > 0 && (
        <Card className="p-6 space-y-3">
          <h3 className="font-semibold text-lg">Evidence you uploaded</h3>
          <ul className="space-y-2">
            {dispute.evidence.map((file: any, i: number) => (
              <li key={i}>
                <a
                  href={file.url}
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  {file.name ?? `Evidence ${i + 1}`}
                </a>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
