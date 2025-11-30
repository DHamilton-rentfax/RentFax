import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/client";

export async function getTenantThemeClient(companyId: string) {
  if (!companyId) return null;
  const snap = await getDoc(doc(db, "tenant_settings", companyId));
  return snap.exists() ? snap.data() : null;
}
