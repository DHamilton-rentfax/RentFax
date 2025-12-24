import { NextRequest, NextResponse } from "next/server";
import { getActivePolicyVersion } from "@/lib/policies/getPolicy";

/**
 * API endpoint to safely expose the latest active version of a policy.
 * Used by client-side components like the PolicyChecklist to get enforcement rules.
 * 
 * @example
 * GET /api/policies/active?policyKey=DISPUTE_EVIDENCE_REQUIREMENTS
 */
export async function GET(req: NextRequest) {
  try {
    const policyKey = new URL(req.url).searchParams.get("policyKey");

    if (!policyKey) {
      return NextResponse.json({ error: "policyKey query parameter is required" }, { status: 400 });
    }

    const data = await getActivePolicyVersion(policyKey);

    if (!data) {
      return NextResponse.json({ error: `Policy not found or not active for key: ${policyKey}` }, { status: 404 });
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error("Error fetching active policy version:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
