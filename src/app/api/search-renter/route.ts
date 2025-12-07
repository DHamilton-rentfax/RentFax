import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { generateIdentityHash } from "@/lib/identity-hash";
import { findAliasMatches } from "@/lib/alias-detection";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, dob, licenseNumber, nationality, emails, phones } = body;

    if (!fullName) {
      return NextResponse.json(
        { error: "Full name is required" },
        { status: 400 }
      );
    }

    // 1️⃣ Generate secure identity hash
    const identityHash = generateIdentityHash({
      fullName,
      dob: dob || null,
      licenseNumber: licenseNumber || null,
      nationality: nationality || null,
      emails: emails || [],
      phones: phones || [],
    });

    // 2️⃣ Query Firestore for direct match
    const directMatchSnap = await adminDb
      .collection("renters")
      .where("identityHash", "==", identityHash)
      .get();

    const directMatches = directMatchSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    // 3️⃣ Alias detection (safe)
    let aliasMatches = [];
    try {
      aliasMatches = await findAliasMatches(adminDb, body);
    } catch (err) {
      console.warn("Alias matching failed:", err);
      aliasMatches = [];
    }

    return NextResponse.json({
      ok: true,
      directMatches,
      aliasMatches,
    });
  } catch (error: any) {
    console.error("SEARCH RENTER ERROR:", error);

    return NextResponse.json(
      { error: "Failed to search renter." },
      { status: 500 }
    );
  }
}
