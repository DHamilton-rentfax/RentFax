"use server";

import { getAdminDb } from "@/firebase/server";

export async function seedDocCategories(orgId: string) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const col = adminDb.collection(`orgs/${orgId}/docCategories`);

  // Skip if already seeded
  const existing = await col.limit(1).get();
  if (!existing.empty) return;

  // Get global defaults
  const defaultsDoc = await adminDb.doc("config/docDefaults").get();
  const DEFAULT_CATEGORIES: string[] = defaultsDoc.exists
    ? defaultsDoc.get("categories")
    : [
        "Lease Agreement",
        "Insurance",
        "ID Verification",
        "Incident Evidence",
        "Other",
      ];

  // Seed them
  const batch = adminDb.batch();
  DEFAULT_CATEGORIES.forEach((name) => {
    const ref = col.doc();
    batch.set(ref, { name, createdAt: Date.now() });
  });
  await batch.commit();
}
