
import { adminDb } from "../firebase/admin";

export async function hasActiveLegalHold(scope: { type: string; id: string }) {
  const snap = await adminDb
    .collection("legal_holds")
    .where("active", "==", true)
    .where("scope.type", "==", scope.type)
    .where("scope.id", "==", scope.id)
    .limit(1)
    .get();
  return !snap.empty;
}
