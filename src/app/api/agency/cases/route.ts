import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

// In a real application, you would get the user's session and token
// to identify their organization. For now, we use a placeholder.
const getPartnerOrgIdFromSession = async (req: Request): Promise<string | null> => {
  // Placeholder logic. Replace with your actual auth system (e.g., NextAuth.js, Clerk).
  // This might involve decoding a JWT from the Authorization header.
  return "PARTNER_ORG_ID_FROM_TOKEN"; // Hardcoded for this example
};

export async function GET(req: Request) {
  try {
    const partnerOrgId = await getPartnerOrgIdFromSession(req);

    if (!partnerOrgId) {
      return NextResponse.json({ error: "Unauthorized: Missing partner organization ID" }, { status: 401 });
    }

    const snap = await adminDb
      .collection("case_assignments")
      .where("assignedToOrgId", "==", partnerOrgId)
      .orderBy("createdAt", "desc")
      .get();

    if (snap.empty) {
      return NextResponse.json({ cases: [] });
    }

    const cases = snap.docs.map((doc) => doc.data());

    return NextResponse.json({ cases });
  } catch (error) {
    console.error("Error fetching assigned cases:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
