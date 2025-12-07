import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { incidents, renter } = await req.json();

  // This will be replaced with OpenAI/Gemini soon:
  const summary = `
Based on ${incidents.length} recorded incident(s) for ${renter.fullName}, the renter demonstrates:

• ${incidents.filter((i: any) => i.publicSignals.includes("Unauthorized Driver")).length > 0
      ? "Use of unauthorized drivers"
      : "No unauthorized driver violations"}

• ${incidents.some((i: any) => i.publicSignals.includes("Criminal Investigation"))
      ? "History involving criminal investigation"
      : "No criminal activity reported"}

• ${incidents.some((i: any) => i.publicSignals.includes("Improper Return"))
      ? "Issues with improper vehicle return"
      : "No abandonment or improper return"}

• ${incidents.some((i: any) => i.publicSignals.includes("Payment Issue"))
      ? "Past due payments or chargebacks"
      : "No payment issues recorded"}

Overall, ${renter.fullName} is considered a ${
    renter.riskScore >= 8 ? "high" :
    renter.riskScore >= 5 ? "moderate" : 
    "low"
  }-risk renter based on available history.
  `;

  return NextResponse.json({ summary });
}
