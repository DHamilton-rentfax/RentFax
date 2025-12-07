import { adminDb } from "@/firebase/server";

export async function linkTenant(companyId: string, propertyId: string, unitId: string, renterId: string, lease: any) {
  await adminDb
    .collection("companies")
    .doc(companyId)
    .collection("properties")
    .doc(propertyId)
    .collection("units")
    .doc(unitId)
    .set(
      {
        tenantId: renterId,
        leaseStart: lease.start,
        leaseEnd: lease.end,
        status: "OCCUPIED",
      },
      { merge: true }
    );
}
