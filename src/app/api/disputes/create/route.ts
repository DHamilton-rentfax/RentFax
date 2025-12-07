import { trackUsage } from "@/lib/billing/track-usage";

export async function POST(req: Request) {
  const body = await req.json();
  const { companyId } = body;

  if (companyId) {
    await trackUsage(companyId, "disputeCreate");
  }

  // ... existing dispute logic ...

  return NextResponse.json({ success: true });
}
