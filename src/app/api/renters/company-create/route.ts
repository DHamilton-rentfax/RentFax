import { adminDb } from "@/firebase/server";
import { generateIdentityHash } from "@/lib/identity-hash";
import { NextResponse } from "next/server";
import { authGuard } from "@/lib/auth-guard";
import { findAliasMatches } from "@/lib/alias-detection";

export async function POST(req: Request) {
  const user = await authGuard(req, { roles: ["COMPANY", "ADMIN", "SUPER_ADMIN"] });

  const body = await req.json();
  const {
    fullName,
    dob,
    licenseNumber,
    nationality,
    emails = [],
    phones = [],
    addressHistory = [],
    incidents = []
  } = body;

  // Hash identity
  const identityHash = generateIdentityHash({
    fullName,
    dob,
    licenseNumber,
    nationality,
    emails,
    phones,
  });

  // Check for existing
  const matchRef = await db
    .collection("renters")
    .where("identityHash", "==", identityHash)
    .limit(1)
    .get();

  if (!matchRef.empty) {
    return NextResponse.json({
      exists: true,
      renterId: matchRef.docs[0].id,
      message: "Renter already exists."
    });
  }

  // Create renter
  const renterRef = adminDb.collection("renters").doc();
  await renterRef.set({
    fullName,
    dob,
    licenseNumber,
    nationality,
    emails,
    phones,
    addressHistory,
    identityHash,
    verificationStatus: "COMPANY_VERIFIED",
    createdBy: user.uid,
    createdAt: new Date(),

    // Hybrid rules (Option B)
    canSelfVerify: true,
    canDispute: false,
    canDisputeUntilVerified: true,
    contactable: false
  });

  // Create incidents
  for (const incident of incidents) {
    const incidentRef = adminDb.collection("incidents").doc();
    await incidentRef.set({
      ...incident,
      renterId: renterRef.id,
      createdBy: user.uid,
      createdAt: new Date(),
    });
  }

  // Find aliases
  const aliasMatches = await findAliasMatches(db, body);
  if (aliasMatches.length > 0) {
    await renterRef.update({ 
      aliases: aliasMatches.map(m => m.id)
    });
  }

  return NextResponse.json({
    success: true,
    renterId: renterRef.id,
    aliasesFound: aliasMatches.length > 0,
  });
}
