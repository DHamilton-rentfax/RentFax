// src/lib/rentfax/utils.ts

import crypto from "crypto";
import { adminDb } from "@/firebase/server";

export function hashLicense(license: string) {
  return crypto.createHash("sha256").update(license.trim().toLowerCase()).digest("hex");
}

/** 
 * Searches for existing renter profiles with the same hashed license 
 * Returns: renterId | null
 */
export async function findExistingRenterByLicense(hash: string) {
  const snapshot = await adminDb
    .collection("renters")
    .where("licenseHash", "==", hash)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  return snapshot.docs[0].id;
}

/**
 * Risk scoring engine:
 * Generates flags based on toggles & data.
 */
export function generateRiskSignals(incident: any) {
  const signals: string[] = [];

  if (incident.unauthorizedDrivers?.length > 0) {
    signals.push("UNAUTHORIZED_DRIVER");
  }
  if (incident.incidentType?.includes("damage")) {
    signals.push("VEHICLE_DAMAGE");
  }
  if (incident.incidentType?.includes("abandonment")) {
    signals.push("ABANDONMENT");
  }
  if (incident.incidentType?.includes("criminal")) {
    signals.push("CRIMINAL_ACTIVITY");
  }
  if (incident.incidentType?.includes("biohazard")) {
    signals.push("BIOHAZARD");
  }
  if (incident.incidentType?.includes("payment")) {
    signals.push("FINANCIAL_RISK");
  }
  if (incident.incidentType?.includes("identity")) {
    signals.push("IDENTITY_ISSUE");
  }

  return signals;
}

/**
 * Creates a shadow profile for unauthorized drivers.
 * Returns: renterId
 */
export async function createShadowProfile(driver: any, companyId: string) {
  const docRef = adminDb.collection("renters").doc();

  await docRef.set({
    fullName: driver.fullName || "",
    dob: driver.dob || null,
    licenseHash: driver.licenseHash || null,
    licenseState: driver.licenseState || null,
    identityStatus: "unauthorized-driver",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    incidentIds: [],
    linkedProfiles: [],
    companyCreated: companyId,
  });

  return docRef.id;
}

/**
 * Creates network graph links between renters
 */
export async function createRenterLink(mainRenter: string, linkedRenter: string, incidentId: string) {
  const ref = adminDb.collection("renterLinks").doc();

  await ref.set({
    parentRenterId: mainRenter,
    linkedRenterId: linkedRenter,
    linkType: "unauthorized-driver",
    incidentId,
    createdAt: Date.now(),
  });
}
