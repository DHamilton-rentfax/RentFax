"use server";

import { getAdminDb } from "@/firebase/server";
import { headers } from "next/headers";

/**
 * Save renter consent under:
 * renters/{renterId}/consents/{companyId}
 */

export async function updateConsent({
  renterId,
  companyId,
  industry = "home_rental",
  version = "v1.0"
}: {
  renterId: string;
  companyId: string;
  industry?: string;
  version?: string;
}) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  if (!renterId || !companyId) {
    throw new Error("Missing renterId or companyId");
  }

  // Option B consent text
  const CONSENT_TEXT = `
I authorize RentFAX, the requesting housing provider, and associated data partners 
to access, share, and evaluate my rental history, incidents, identity, 
and dispute records for the purpose of rental application screening. 
This consent remains valid for 60 days.
  `.trim();

  const consentRef = adminDb
    .collection("renters")
    .doc(renterId)
    .collection("consents")
    .doc(companyId);

  const existing = await consentRef.get();

  // Get request IP (for legal/audit compliance)
  const ip = headers().get("x-forwarded-for") || "unknown";

  // If consent already exists and is valid (within 60 days), skip saving
  if (existing.exists) {
    const data = existing.data();
    const now = Date.now();
    const signed = data?.signedAt?.toMillis?.() ?? 0;
    const daysPassed = (now - signed) / (1000 * 60 * 60 * 24);

    if (daysPassed < 60) {
      return {
        success: true,
        reused: true,
        message: "Existing valid consent found."
      };
    }
  }

  // Save consent
  await consentRef.set({
    renterId,
    companyId,
    industries: [industry],      // Always home_rental for consent
    consentVersion: version,
    consentText: CONSENT_TEXT,
    ipAddress: ip,
    signedAt: new Date()
  });

  return {
    success: true,
    reused: false,
    message: "Consent recorded successfully."
  };
}
