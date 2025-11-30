import Link from "next/link";
import { adminDb } from "@/firebase/server";
import { IdentityVerificationResult } from "@/types/identity";
import { FraudSummary } from "@/types/fraud";

type IdentityQueueItem = {
  id: string;
  fullName: string;
  createdAt: number;
  lastIdentityAttemptAt?: number;
  identity?: IdentityVerificationResult | null;
  fraud?: FraudSummary | null;
  manualVerificationStatus?: "PENDING" | "APPROVED" | "REJECTED";
};

async function getIdentityQueue(): Promise<IdentityQueueItem[]> {
  const snap = await adminDb
    .collection("renters")
    .orderBy("lastIdentityAttemptAt", "desc")
    .limit(100)
    .get();

  const items: IdentityQueueItem[] = [];
  snap.forEach((doc) => {
    const data = doc.data() as any;
    if (!data) return;

    items.push({
      id: doc.id,
      fullName: data.fullName ?? "Unknown Renter",
      createdAt: data.createdAt ?? 0,
      lastIdentityAttemptAt: data.lastIdentityAttemptAt,
      identity: data.identity ?? null,
      fraud: data.fraud ?? null,
      manualVerificationStatus: data.manualVerificationStatus ?? "PENDING",
    });
  });

  return items;
}

export default async function AdminIdentityQueuePage() {
  const items = await getIdentityQueue();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Identity Review Queue</h1>
        <p className="text-sm text-gray-500">
          Showing {items.length} recent identity checks
        </p>
      </div>

      <div className="grid gap-3">
        {items.length === 0 && (
          <div className="p-4 border rounded-lg text-sm text-gray-500">
            No identity checks have been attempted yet.
          </div>
        )}

        {items.map((renter) => {
          const riskScore = renter.fraud?.fraudScore ?? 0;
          const idScore = renter.identity?.finalScore ?? null;
          const verified = renter.identity?.verified ?? false;
          const statusBadge =
            renter.manualVerificationStatus === "APPROVED"
              ? "bg-green-100 text-green-800"
              : renter.manualVerificationStatus === "REJECTED"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800";

          return (
            <Link
              key={renter.id}
              href={`/dashboard/admin/verification/${renter.id}`}
              className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition"
            >
              <div>
                <div className="font-semibold">{renter.fullName}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Renter ID: {renter.id}
                </div>
                <div className="text-xs text-gray-500">
                  Last attempt:{" "}
                  {renter.lastIdentityAttemptAt
                    ? new Date(
                        renter.lastIdentityAttemptAt,
                      ).toLocaleString()
                    : "Never"}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="text-right">
                  <div>Identity Score</div>
                  <div className="font-semibold">
                    {idScore !== null ? idScore : "—"}
                  </div>
                </div>
                <div className="text-right">
                  <div>Fraud Score</div>
                  <div className="font-semibold">
                    {riskScore ? riskScore : "—"}
                  </div>
                </div>
                <div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${statusBadge}`}
                  >
                    {verified ? "Verified" : "Unverified"} ·{" "}
                    {renter.manualVerificationStatus ?? "PENDING"}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
