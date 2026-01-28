import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import admin from "firebase-admin";

/**
 * Firebase Admin MUST run in Node
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AnnouncementType = "info" | "promo" | "urgent" | "blog";

interface AnnouncementResponse {
  id: string;
  type: AnnouncementType;
  title: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
}

export async function GET(req: NextRequest) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const { searchParams } = new URL(req.url);

    const plan = (searchParams.get("plan") || "guest").toLowerCase();
    const tenantId = searchParams.get("tenantId");
    const role = searchParams.get("role");

    /**
     * IMPORTANT:
     * Keep Firestore query SIMPLE to avoid index explosions.
     * Do advanced filtering in memory.
     */
    const query = adminDb
      .collection("announcements")
      .where("active", "==", true)
      .orderBy("createdAt", "desc")
      .limit(10);

    const snapshot = (await Promise.race([
      query.get(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Firestore timeout")), 3000)
      ),
    ])) as admin.firestore.QuerySnapshot;

    const now = Date.now();
    const result: AnnouncementResponse[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data() ?? {};

      // --- Time window guards ---
      const startAt = data.startAt?.toMillis?.() ?? null;
      const endAt = data.endAt?.toMillis?.() ?? null;

      if (startAt && now < startAt) return;
      if (endAt && now > endAt) return;

      // --- Audience filters (opt-in logic) ---
      const plans = Array.isArray(data.audiencePlans)
        ? data.audiencePlans.map((p: string) => p.toLowerCase())
        : [];

      const tenants = Array.isArray(data.audienceTenants)
        ? data.audienceTenants
        : [];

      const roles = Array.isArray(data.audienceRoles)
        ? data.audienceRoles
        : [];

      if (plans.length && !plans.includes(plan)) return;
      if (tenants.length && (!tenantId || !tenants.includes(tenantId))) return;
      if (roles.length && (!role || !roles.includes(role))) return;

      // --- Safe projection ---
      result.push({
        id: doc.id,
        type: (data.type as AnnouncementType) ?? "info",
        title: typeof data.title === "string" ? data.title : "",
        description:
          typeof data.description === "string" ? data.description : undefined,
        href: typeof data.href === "string" ? data.href : undefined,
        ctaLabel:
          typeof data.ctaLabel === "string" ? data.ctaLabel : undefined,
      });
    });

    return NextResponse.json({
      ok: true,
      announcements: result,
    });
  } catch (err) {
    console.error("[announcements] fatal error", err);

    /**
     * NEVER 500 for announcements.
     * This is non-critical UI data.
     */
    return NextResponse.json({
      ok: false,
      announcements: [],
    });
  }
}
