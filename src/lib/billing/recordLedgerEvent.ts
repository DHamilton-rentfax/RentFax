import { adminDb } from "@/firebase/server";
import { LedgerEntry } from "@/types/ledger";

export async function recordLedgerEvent(event: Omit<LedgerEntry, "id" | "createdAt">) {
  const entry = {
    ...event,
    createdAt: new Date().toISOString(),
  };

  const ref = await adminDb.collection("reportLedger").add(entry);

  return {
    id: ref.id,
    ...entry,
  } as LedgerEntry;
}
