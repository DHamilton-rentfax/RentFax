import { adminDb } from "@/firebase/server";
import { IdentityVerificationResult } from "@/types/identity";
import { FraudSummary } from "@/types/fraud";
import { PublicDataSummary } from "@/types/public-data";
import IdentityOverridePanel from "./IdentityOverridePanel";

type RenterDoc = {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  identity?: IdentityVerificationResult | null;
  fraud?: FraudSummary | null;
  publicData?: PublicDataSummary | null;
  identityAttempts?: number;
  lastIdentityAttemptAt?: number;
  manualVerificationStatus?: "PENDING" | "APPROVED" | "REJECTED";
  manualVerificationNotes?: string;
};

async function getRenter(id: string): Promise<RenterDoc | null> {
  const snap = await adminDb.collection("renters").doc(id).get();
  if (!snap.exists) return null;
  return snap.data() as RenterDoc;
}

export default async function AdminVerificationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const renter = await getRenter(params.id);

  if (!renter) {
    return <div className="p-6">Renter not found.</div>;
  }

  const identity = renter.identity ?? null;
  const fraud = renter.fraud ?? null;
  const publicData = renter.publicData ?? null;

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Identity Review</h1>
          <p className="text-sm text-gray-500">
            Renter: {renter.fullName} · ID: {params.id}
          </p>
        </div>
      </div>

      {/* Top summary row */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="border rounded-lg p-4">
          <div className="text-xs text-gray-500">Identity Score</div>
          <div className="text-2xl font-semibold mt-1">
            {identity?.finalScore ?? "—"}
          </div>
          <div className="text-xs mt-2 text-gray-600">
            Status: {identity?.verified ? "Verified" : "Not Verified"}
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="text-xs text-gray-500">Fraud Score</div>
          <div className="text-2xl font-semibold mt-1">
            {fraud?.fraudScore ?? "—"}
          </div>
          <div className="text-xs mt-2 text-gray-600">
            Signals: {fraud?.fraudSignals?.length ?? 0}
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="text-xs text-gray-500">Attempts</div>
          <div className="text-2xl font-semibold mt-1">
            {renter.identityAttempts ?? 0}
          </div>
          <div className="text-xs mt-2 text-gray-600">
            Last attempt:{" "}
            {renter.lastIdentityAttemptAt
              ? new Date(renter.lastIdentityAttemptAt).toLocaleString()
              : "Never"}
          </div>
        </div>
      </div>

      {/* Face / OCR / Public Records breakdown */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="border rounded-lg p-4">
          <h2 className="font-semibold mb-2">Face Match</h2>
          <p className="text-sm">Score: {identity?.faceMatchScore ?? "—"}</p>
          <p className="text-xs text-gray-600 mt-2">
            Review selfie & ID images in storage if needed.
          </p>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="font-semibold mb-2">OCR & Profile</h2>
          <p className="text-sm">
            Name on ID: {identity?.ocrData?.fullName ?? "—"}
          </p>
          <p className="text-sm">DOB: {identity?.ocrData?.dob ?? "—"}</p>
          <p className="text-sm">
            Address: {identity?.ocrData?.address ?? "—"}
          </p>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="font-semibold mb-2">Public Records</h2>
          <p className="text-sm">
            Matches: {publicData?.matches?.length ?? 0}
          </p>
          <p className="text-sm">
            Match Score: {publicData?.matchScore ?? "—"}
          </p>
        </div>
      </div>

      {/* Fraud signal list */}
      <div className="border rounded-lg p-4">
        <h2 className="font-semibold mb-3">Fraud Signals</h2>
        {fraud?.fraudSignals?.length ? (
          <ul className="space-y-2">
            {fraud.fraudSignals.map((s) => (
              <li key={s.id} className="text-sm">
                <span className="font-semibold">{s.label}</span>{" "}
                <span className="text-xs uppercase text-gray-500">
                  ({s.severity})
                </span>
                {s.description && (
                  <div className="text-xs text-gray-600">
                    {s.description}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No fraud signals recorded.</p>
        )}
      </div>

      {/* Manual Override Panel (client) */}
      <IdentityOverridePanel
        renterId={params.id}
        currentStatus={renter.manualVerificationStatus ?? "PENDING"}
        currentNotes={renter.manualVerificationNotes ?? ""}
      />
    </div>
  );
}
