import { adminDb } from "@/firebase/server";
import { generateIdentityHash } from "@/lib/identity-hash";
import { NextResponse } from "next/server";
import { findAliasMatches } from "@/lib/alias-detection";

export async function POST(req: Request) {
  const body = await req.json();
  const { fullName, dob, licenseNumber, nationality, emails, phones } = body;

  const identityHash = generateIdentityHash({
    fullName,
    dob,
    licenseNumber,
    nationality,
    emails,
    phones,
  });

  const directMatchQuery = await db
    .collection("renters")
    .where("identityHash", "==", identityHash)
    .get();

  const directMatches = directMatchQuery.docs.map((doc) => doc.data());

  const aliasMatches = await findAliasMatches(db, body);

  return NextResponse.json({ directMatches, aliasMatches });
}
