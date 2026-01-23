import { adminDb } from "@/firebase/server";

export async function getTenantBranding(tenantId: string) {
  const snap = await adminDb.collection("companies").doc(tenantId).get();
  if (!snap.exists) throw new Error("Tenant not found");

  const data = snap.data() as any;

  return {
    companyName: data.name,
    logoUrl: data.logoUrl,
    theme: data.theme || {
      primary: "#111827",
      secondary: "#4B5563",
      background: "#ffffff",
      text: "#111827",
    }
  };
}
