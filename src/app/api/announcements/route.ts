// src/app/api/announcements/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export const dynamic = "force-dynamic"; // ensure fresh data for marketing

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
  try {
    const { searchParams } = new URL(req.url);

    const plan = (searchParams.get("plan") || "guest").toLowerCase();
    const tenantId = searchParams.get("tenantId") || null;
    const role = searchParams.get("role") || null;

    // Base query: active announcements only
    let query = adminDb
      .collection("announcements")
      .where("active", "==", true)
      .orderBy("priority", "desc")
      .orderBy("createdAt", "desc");

    const snapshot = await query.get();

    const now = Date.now();

    const result: AnnouncementResponse[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data() as any;

      // Time window filter (optional)
      const startAt = data.startAt?.toMillis?.() ?? null;
      const endAt = data.endAt?.toMillis?.() ?? null;

      if (startAt && now < startAt) return;
      if (endAt && now > endAt) return;

      // Audience filters (all are "opt-in" – if array is missing/empty, treat as "all")
      const plans: string[] = Array.isArray(data.audiencePlans)
        ? data.audiencePlans.map((p: string) => p.toLowerCase())
        : [];

      const tenants: string[] = Array.isArray(data.audienceTenants)
        ? data.audienceTenants
        : [];

      const roles: string[] = Array.isArray(data.audienceRoles)
        ? data.audienceRoles
        : [];

      // Plan match: if no plans listed, it's global;
      // otherwise the plan must be included.
      if (plans.length > 0 && !plans.includes(plan)) return;

      // Tenant match: if audienceTenants set, must match; otherwise global
      if (tenants.length > 0 && (!tenantId || !tenants.includes(tenantId))) {
        return;
      }

      // Role match: similar logic
      if (roles.length > 0 && (!role || !roles.includes(role))) {
        return;
      }

      result.push({
        id: doc.id,
        type: (data.type as AnnouncementType) || "info",
        title: data.title,
        description: data.description,
        href: data.href,
        ctaLabel: data.ctaLabel,
      });
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("[GET /api/announcements] error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
