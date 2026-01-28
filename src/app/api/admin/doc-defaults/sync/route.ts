import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function POST() {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const defaultsDoc = await adminDb.doc("config/docDefaults").get();
  if (!defaultsDoc.exists) {
    return NextResponse.json({ error: "No defaults set" }, { status: 400 });
  }

  const DEFAULT_CATEGORIES: string[] = defaultsDoc.get("categories");
  const orgs = await adminDb.collection("orgs").get();

  for (const org of orgs.docs) {
    const orgId = org.id;
    const col = adminDb.collection(`orgs/${orgId}/docCategories`);
    const existingSnap = await col.get();
    const existingNames = existingSnap.docs.map((d) => d.get("name"));
    const missing = DEFAULT_CATEGORIES.filter(
      (c) => !existingNames.includes(c),
    );

    if (missing.length > 0) {
      const batch = adminDb.batch();
      missing.forEach((name) => {
        const ref = col.doc();
        batch.set(ref, { name, createdAt: Date.now() });
      });
      await batch.commit();

      const logEntry = {
        orgId,
        actorUid: "super-admin", // TODO: real session UID
        action: "DOC_DEFAULTS_SYNC",
        target: "docCategories",
        details: { added: missing },
        timestamp: Date.now(),
      };

      // Org-level audit
      await adminDb.collection(`orgs/${orgId}/audit`).add(logEntry);

      // Global audit
      await adminDb.collection("auditGlobal").add(logEntry);
    }
  }

  return NextResponse.json({
    ok: true,
    message: "Defaults synced to all orgs",
  });
}
