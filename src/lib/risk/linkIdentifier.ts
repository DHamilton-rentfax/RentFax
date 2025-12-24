
import * as crypto from 'crypto';
import { admin, adminDb } from '@/lib/firebase/admin'; // Assuming admin and adminDb are initialized

/**
 * Hashes a value using SHA256.
 * @param value The string to hash.
 * @returns The hex-encoded hash.
 */
function hashValue(value: string): string {
  return crypto
    .createHash("sha256")
    .update(value.trim().toLowerCase())
    .digest("hex");
}

/**
 * Links an identifier to a renter, incident, and report.
 * This is the core of the cross-report link detection engine.
 */
export async function linkIdentifier({
  type,
  rawValue,
  renterId,
  incidentId,
  reportId,
}: {
  type: 'ADDRESS' | 'PHONE' | 'EMAIL' | 'DEVICE' | 'PAYMENT_ACCOUNT';
  rawValue: string;
  renterId: string;
  incidentId?: string;
  reportId?: string;
}) {
  const hash = hashValue(rawValue);
  const ref = adminDb.collection("risk_identifiers").doc(hash);

  const dataToSet = {
    type,
    hash,
    linkedRenters: admin.firestore.FieldValue.arrayUnion(renterId),
    lastSeenAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  if (incidentId) {
    dataToSet.linkedIncidents = admin.firestore.FieldValue.arrayUnion(incidentId);
  }

  if (reportId) {
    dataToSet.linkedReports = admin.firestore.FieldValue.arrayUnion(reportId);
  }

  await ref.set(dataToSet, { merge: true });

  // Set firstSeenAt only on creation
  const doc = await ref.get();
  if (!doc.data()?.firstSeenAt) {
      await ref.set({ firstSeenAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  }
}
