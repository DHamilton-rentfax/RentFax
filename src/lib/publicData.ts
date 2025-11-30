// src/lib/publicData.ts

import { getFirebaseAdminApp } from "@/lib/firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

const app = getFirebaseAdminApp();
const db = getFirestore(app);

/* ---------------------------------------------------------
 * CACHE HELPERS (AVOID DUPLICATE API COSTS)
 * --------------------------------------------------------- */

export async function cachePublicData(renterId: string, profile: any) {
  await db.collection("publicCache").doc(renterId).set(
    {
      profile,
      cachedAt: new Date(),
    },
    { merge: true }
  );
}

export async function getCachedPublicData(renterId: string) {
  const snap = await db.collection("publicCache").doc(renterId).get();
  if (!snap.exists) return null;

  const data = snap.data();
  // Firestore Timestamps need to be converted to JS Dates
  if (data && data.cachedAt && data.cachedAt.toDate) {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    if (data.cachedAt.toDate() < twentyFourHoursAgo) {
      // Cache is older than 24 hours, so ignore it
      return null;
    }
  }
  return data.profile;
}

/* ---------------------------------------------------------
 * COURT RECORDS — CourtListener API (Free Public Records)
 * --------------------------------------------------------- */

export async function getCourtRecordsFromPublic(input: {
  fullName: string;
  city?: string;
  state?: string;
}) {
  try {
    const query = encodeURIComponent(input.fullName);
    const url = `https://www.courtlistener.com/api/rest/v3/search/?q=${query}&type=docket`;

    const res = await fetch(url);
    if (!res.ok) return [];

    const data = await res.json();

    if (!data.results || data.results.length === 0) return [];

    return data.results.map((rec: any) => ({
      id: rec.id?.toString(),
      caseNumber: rec.caseName || "Unknown Case",
      courtName: rec.court || "Unknown Court",
      filingDate: rec.dateFiled || null,
      type: "CIVIL_JUDGMENT",
      status: rec.opinionStatus || null,
      url: rec.absolute_url ? `https://www.courtlistener.com${rec.absolute_url}` : undefined,
    }));
  } catch (err) {
    console.error("CourtListener error:", err);
    return [];
  }
}

/* ---------------------------------------------------------
 * ADDRESS HISTORY — MOCK (UPGRADE TO PAID LATER)
 * --------------------------------------------------------- */

export async function getAddressHistoryFromPublic(input: {
  fullName: string;
  email?: string;
  phone?: string;
}) {
  // Use this stub until we integrate PeopleDataLabs / TLO / LexisNexis.
  return [
    {
      address: "123 Main St",
      city: "Los Angeles",
      state: "CA",
      postalCode: "90001",
      country: "USA",
      fromDate: "2020-01-01",
      toDate: "2022-01-01",
    },
    {
      address: "742 Evergreen Terrace",
      city: "Springfield",
      state: "IL",
      postalCode: "62701",
      country: "USA",
      fromDate: "2018-01-01",
      toDate: "2019-12-31",
    },
  ];
}

/* ---------------------------------------------------------
 * PHONE VALIDATION — AbstractAPI (Free Tier)
 * --------------------------------------------------------- */

export async function validatePhonePublic(phone?: string) {
  if (!phone) return null;

  try {
    const apiKey = process.env.ABSTRACT_PHONE_API_KEY!;
    const url = `https://phonevalidation.abstractapi.com/v1/?api_key=${apiKey}&phone=${phone}`;

    const res = await fetch(url);
    if (!res.ok) return { phone, valid: false, risk: "high" };

    const data = await res.json();

    return {
      phone,
      valid: data.valid,
      lineType: data.line_type || "unknown",
      carrier: data.carrier || "unknown",
      risk: data.valid ? "low" : "high",
    };
  } catch {
    return { phone, valid: false, risk: "medium" };
  }
}

/* ---------------------------------------------------------
 * EMAIL VALIDATION — AbstractAPI (Free Tier)
 * --------------------------------------------------------- */

export async function validateEmailPublic(email?: string) {
  if (!email) return null;

  try {
    const apiKey = process.env.ABSTRACT_EMAIL_API_KEY!;
    const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${email}`;

    const res = await fetch(url);
    if (!res.ok) return { email, valid: false, disposable: false, risk: "high" };

    const data = await res.json();

    return {
      email,
      valid: data.deliverability === "DELIVERABLE",
      disposable: data.is_disposable_email?.value || false,
      risk: data.deliverability === "DELIVERABLE" ? "low" : "medium",
    };
  } catch {
    return { email, valid: false, disposable: false, risk: "medium" };
  }
}

/* ---------------------------------------------------------
 * PUBLIC IDENTITY PROFILE BUILDER
 * --------------------------------------------------------- */

export async function buildPublicIdentityProfile(input: {
  renterId?: string;
  fullName: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
}) {
  const renterId = input.renterId || input.fullName.toLowerCase().replace(/\s/g, "_");

  // First: check cache
  const cached = await getCachedPublicData(renterId);
  if (cached) return cached;

  // Hit all public data providers in parallel
  const [courtRecords, addresses, phoneVal, emailVal] = await Promise.all([
    getCourtRecordsFromPublic(input),
    getAddressHistoryFromPublic(input),
    validatePhonePublic(input.phone),
    validateEmailPublic(input.email),
  ]);

  const hasAny =
    (courtRecords && courtRecords.length > 0) ||
    (addresses && addresses.length > 0) ||
    phoneVal ||
    emailVal;

  if (!hasAny) return null;

  const profile = {
    fullName: input.fullName,
    normalizedName: input.fullName.trim().toLowerCase(),
    matchConfidence: 0.75, // base starting point, can improve later
    courtRecords,
    addresses,
    phoneValidation: phoneVal,
    emailValidation: emailVal,
  };

  // Cache result
  await cachePublicData(renterId, profile);

  return profile;
}
