// src/lib/ledger/recordLedgerEvent.ts
import { adminDb } from "@/firebase/server";
import { Timestamp } from "firebase-admin/firestore";
import type { LedgerEntry } from "@/types/ledger";

type NewLedgerEvent = Omit<LedgerEntry, "id" | "createdAt">;

export async function recordLedgerEvent(event: NewLedgerEvent) {
  const entry = {
    ...event,
    createdAt: Timestamp.now(),
  };

  const ref = await adminDb.collection("ledger").add(entry);

  return {
    id: ref.id,
    ...entry,
  } satisfies LedgerEntry;
}
