"use server";

import { adminDB } from "@/firebase/server";

export async function seedDocCategories(orgId: string) {
  const col = adminDB.collection(`orgs/${orgId}/docCategories`);

  // Skip if already seeded
  const existing = await col.limit(1).get();
  if (!existing.empty) return;

  // Get global defaults
  const defaultsDoc = await adminDB.doc("config/docDefaults").get();
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
  const batch = adminDB.batch();
  DEFAULT_CATEGORIES.forEach((name) => {
    const ref = col.doc();
    batch.set(ref, { name, createdAt: Date.now() });
  });
  await batch.commit();
}
