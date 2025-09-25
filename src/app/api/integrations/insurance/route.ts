import { NextRequest, NextResponse } from "next/server";

/**
 * Fake insurance validation.
 * Replace with real provider (e.g. Assurant, State National API).
 */
export async function POST(req: NextRequest) {
  const { renterId, policyNumber } = await req.json();

  // Simulated response
  const isValid = policyNumber && policyNumber.startsWith("POL");

  return NextResponse.json({
    renterId,
    policyNumber,
    valid: isValid,
    provider: isValid ? "Simulated Insurance Co." : null,
  });
}
