import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/firebase/server";

async function requireSuperAdmin(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    throw new Error("Unauthorized");
  }

  const decoded = await adminAuth.verifyIdToken(token);
  if (decoded.role !== "super_admin") {
    throw new Error("Forbidden");
  }

  return decoded;
}

const SETTINGS_DOC_REF = adminDb
  .collection("settings")
  .doc("featureFlags");

/**
 * Get current feature flags
 */
export async function GET(req: Request) {
  try {
    await requireSuperAdmin(req);

    const doc = await SETTINGS_DOC_REF.get();
    return NextResponse.json(doc.exists ? doc.data() : {});
  } catch (err: any) {
    if (err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (err.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    console.error("Failed to get feature flags:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * Update feature flags
 */
export async function POST(req: Request) {
  try {
    await requireSuperAdmin(req);

    const flagsToUpdate = await req.json();

    await SETTINGS_DOC_REF.set(flagsToUpdate, { merge: true });

    return NextResponse.json({
      success: true,
      updated: flagsToUpdate,
    });
  } catch (err: any) {
    if (err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (err.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    console.error("Failed to update feature flags:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
