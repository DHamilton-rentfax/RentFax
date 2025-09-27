import { NextResponse } from "next/server";
import { adminDB } from "@/firebase/server";

export async function GET() {
  const orgs = await adminDB.collection("orgs").get();

  let totalRenters = 0;
  let totalDisputes = 0;
  let fraudFlags = 0;

  for (const org of orgs.docs) {
    const renters = await adminDB.collection(`orgs/${org.id}/renters`).get();
    const disputes = await adminDB.collection(`orgs/${org.id}/disputes`).get();
    const flagged = renters.docs.filter(d => d.get("fraudFlag") === true).length;

    totalRenters += renters.size;
    totalDisputes += disputes.size;
    fraudFlags += flagged;
  }

  const engagementSnap = await adminDB
    .collection("analyticsEvents")
    .where("event", "in", ["report_previewed", "report_downloaded"])
    .where("ts", ">=", Date.now() - 30 * 24 * 60 * 60 * 1000)
    .get();

  let previewed = 0;
  let downloaded = 0;

  engagementSnap.forEach((doc) => {
    const e = doc.data();
    if (e.event === "report_previewed") previewed++;
    if (e.event === "report_downloaded") downloaded++;
  });

  // Aggregate daily
  const engagementTimeline: Record<string, { previewed: number; downloaded: number }> = {};
  engagementSnap.forEach((doc) => {
    const e = doc.data();
    const date = new Date(e.ts).toISOString().slice(0, 10);
    if (!engagementTimeline[date]) {
      engagementTimeline[date] = { previewed: 0, downloaded: 0 };
    }
    if (e.event === "report_previewed") engagementTimeline[date].previewed++;
    if (e.event === "report_downloaded") engagementTimeline[date].downloaded++;
  });

  // Org-level breakdown
  const orgEngagement: Record<
    string,
    { previewed: number; downloaded: number }
  > = {};

  engagementSnap.forEach((doc) => {
    const e = doc.data();
    const orgId = e.orgId || "unknown";
    if (!orgEngagement[orgId]) {
      orgEngagement[orgId] = { previewed: 0, downloaded: 0 };
    }
    if (e.event === "report_previewed") orgEngagement[orgId].previewed++;
    if (e.event === "report_downloaded") orgEngagement[orgId].downloaded++;
  });

  // fetch org names
  const orgsData: Record<string, any> = {};
  const orgIds = Object.keys(orgEngagement);
  if (orgIds.length) {
    const orgDocs = await adminDB.getAll(
      ...orgIds.map((id) => adminDB.collection("orgs").doc(id))
    );
    orgDocs.forEach((doc) => {
      if (doc.exists) orgsData[doc.id] = doc.data();
    });
  }

  return NextResponse.json({
    totalOrgs: orgs.size,
    totalRenters,
    totalDisputes,
    fraudFlags,
    engagement: {
      totals: { previewed, downloaded },
      timeline: Object.entries(engagementTimeline).map(([date, v]) => ({
        date,
        previewed: v.previewed,
        downloaded: v.downloaded,
      })),
      byOrg: orgIds.map((id) => ({
        orgId: id,
        orgName: orgsData[id]?.name || "Unknown Org",
        previewed: orgEngagement[id].previewed,
        downloaded: orgEngagement[id].downloaded,
      })),
    },
  });
}
