import { trackUsage } from "@/lib/billing/track-usage";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { companyId } = body;

    if (companyId) {
      await trackUsage(companyId, "fullReport");
    }

    // ... existing report creation logic ...

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create report." });
  }
}
