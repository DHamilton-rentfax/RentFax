import { adminDb } from "@/firebase/server";
import { Timestamp } from "firebase-admin/firestore";
import type { LedgerEntry, LedgerAction } from "@/types/ledger";

/**
 * Allowed filters when querying ledger entries.
 * All fields are optional and safely composable.
 */
export type LedgerQuery = {
  actorId?: string;
  action?: LedgerAction;
  relatedObject?: string;
  startDate?: string; // ISO 8601 string
  endDate?: string;   // ISO 8601 string
};

/**
 * Fetch ledger entries with optional filtering.
 * Results are always ordered by createdAt DESC.
 *
 * IMPORTANT:
 * - `createdAt` is stored as Firestore Timestamp
 * - Dates must be converted to Timestamp for querying
 */
export async function getLedgerEntries(
  query: LedgerQuery
): Promise<LedgerEntry[]> {
  let q: FirebaseFirestore.Query = adminDb.collection("ledger");

  if (query.actorId) {
    q = q.where("actorId", "==", query.actorId);
  }

  if (query.action) {
    q = q.where("action", "==", query.action);
  }

  if (query.relatedObject) {
    q = q.where("relatedObject", "==", query.relatedObject);
  }

  if (query.startDate) {
    const start = new Date(query.startDate);
    if (!isNaN(start.getTime())) {
      q = q.where("createdAt", ">=", Timestamp.fromDate(start));
    }
  }

  if (query.endDate) {
    const end = new Date(query.endDate);
    if (!isNaN(end.getTime())) {
      q = q.where("createdAt", "<=", Timestamp.fromDate(end));
    }
  }

  const snapshot = await q.orderBy("createdAt", "desc").get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<LedgerEntry, "id">),
  }));
}
