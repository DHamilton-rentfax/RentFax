sddimport { adminDb } from "@/firebase/server";

export async function getTenantTheme(companyId: string) {
  if (!companyId) throw new Error("Missing companyId");

  const snap = await adminDb.collection("tenant_settings").doc(companyId).get();
  if (!snap.exists) {
    return {
      // fallback RentFAX brand
      name: "RentFAX",
      primaryColor: "#4F46E5",
      sidebarBg: "#111827",
      sidebarText: "#E5E7EB",
      logoUrl: "/logo.png",
    };
  }

  return snap.data();
}
