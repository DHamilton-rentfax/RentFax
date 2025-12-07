import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { verifySuperAdmin } from "@/lib/auth/verifySuperAdmin";

const SETTINGS_DOC_REF = adminDb.collection("settings").doc("featureFlags");

/**
 * @description Get the current feature flag settings
 */
export async function GET(req: Request) {
  try {
    const user = await verifySuperAdmin();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const doc = await SETTINGS_DOC_REF.get();

    if (!doc.exists) {
      // Default flags if none are set
      const defaultFlags = {
        enableConfidenceScore: false,
        showConfidenceInAdmin: true,
        showConfidenceToLandlords: false,
      };
      return NextResponse.json(defaultFlags);
    }

    return NextResponse.json(doc.data());
  } catch (err: any) {
    console.error("Failed to get feature flags:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * @description Update feature flag settings
 * @body { [key: string]: boolean } flags - An object of flags to update
 */
export async function POST(req: Request) {
  try {
    const user = await verifySuperAdmin();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const flagsToUpdate = await req.json();

    if (typeof flagsToUpdate !== "object" || flagsToUpdate === null) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Update the document, creating it if it doesn't exist
    await SETTINGS_DOC_REF.set(flagsToUpdate, { merge: true });

    // Create an audit log
    await adminDb.collection("auditLogs").add({
      type: "FEATURE_FLAGS_UPDATED",
      flags: flagsToUpdate,
      superAdminId: user.uid,
      timestamp: Date.now(),
    });

    return NextResponse.json({ success: true, updated: flagsToUpdate });
  } catch (err: any) {
    console.error("Failed to update feature flags:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
