"use server";

import { getAdminDb } from "@/firebase/server"; // Firebase Admin Firestore

export type EnterpriseRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface EnterpriseRequest {
  id: string;
  companyName: string;
  fullName: string;
  email: string;
  phone?: string;
  industry?: string;
  locations?: string;
  status: EnterpriseRequestStatus;
  createdAt?: string;
  riskScore?: number;
  duplicateMatches?: number;
  flags?: string[];
  ein?: string;
  duns?: string;
  website?: string;
}

function normalizeCompanyName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[,\.]/g, "")
    .replace(/\b(inc|llc|corp|co|limited|ltd)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Fetch Enterprise applications, optionally filtered by status.
 */
export async function getEnterpriseRequests(
  status: EnterpriseRequestStatus | "ALL" = "PENDING"
): Promise<EnterpriseRequest[]> {
  let q = adminDb.collection("enterprise_requests").orderBy("createdAt", "desc");

  if (status !== "ALL") {
    q = q.where("status", "==", status);
  }

  const snap = await q.get();

  return snap.docs.map((docSnap) => {
    const data = docSnap.data() || {};
    return {
      id: docSnap.id,
      companyName: data.companyName || "",
      fullName: data.fullName || "",
      email: data.email || "",
      phone: data.phone || "",
      industry: data.industry || "",
      locations: data.locations || "",
      status: (data.status as EnterpriseRequestStatus) || "PENDING",
      createdAt: data.createdAt?.toDate?.().toISOString?.() ?? null,
      riskScore: data.riskScore ?? null,
      duplicateMatches: data.duplicateMatches ?? 0,
      flags: data.flags ?? [],
      ein: data.ein || "",
      duns: data.duns || "",
      website: data.website || ""
    };
  });
}

/**
 * Update the status of a request (APPROVED / REJECTED).
 * You can extend this to create orgs, send emails, etc.
 */
export async function updateEnterpriseRequestStatus(params: {
  id: string;
  status: EnterpriseRequestStatus;
  reviewerId?: string;
  notes?: string;
}) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { id, status, reviewerId, notes } = params;

  const ref = adminDb.collection("enterprise_requests").doc(id);
  
  const docSnap = await ref.get();
  if (!docSnap.exists) {
    throw new Error("Enterprise request not found");
  }
  const req = docSnap.data() as EnterpriseRequest;


  await ref.set(
    {
      status,
      reviewerId: reviewerId || null,
      reviewerNotes: notes || null,
      statusUpdatedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  if (status === "APPROVED") {
    await adminDb.collection("companies").doc(id).set({
      companyName: req.companyName,
      industry: req.industry,
      ein: req.ein,
      duns: req.duns,
      locations: req.locations,
      createdAt: new Date().toISOString(),
      approvedBy: reviewerId,
      plan: "ENTERPRISE",
      whiteLabel: false,
      orgType: "enterprise",
      members: [],
      domains: req.website ? [req.website] : [],
    });
  }
}

/**
 * Simple duplicate / fraud-style heuristic checker.
 * Later you can swap this to a Genkit / Gemini flow, but this works now.
 */
export async function runEnterpriseDuplicateCheck(id: string) {
  const ref = adminDb.collection("enterprise_requests").doc(id);
  const docSnap = await ref.get();

  if (!docSnap.exists) {
    throw new Error("Enterprise request not found");
  }

  const req = docSnap.data() as EnterpriseRequest;
  const companyName = (req.companyName || "").toString();
  const email = (req.email || "").toString();
  const phone = (req.phone || "").toString();
  const normalizedName = normalizeCompanyName(companyName);
  const emailDomain = email.split("@")[1]?.toLowerCase() || "";

  // 1. Load all other enterprise requests to compare against
  const allSnap = await adminDb.collection("enterprise_requests").get();

  let duplicateMatches = 0;
  const flags: string[] = [];

  allSnap.forEach((otherDoc) => {
    if (otherDoc.id === docSnap.id) return;
    const data = otherDoc.data() as EnterpriseRequest;

    const otherName = normalizeCompanyName(data.companyName || "");
    const otherEmail: string = data.email || "";
    const otherPhone: string = data.phone || "";

    const otherDomain = otherEmail.split("@")[1]?.toLowerCase() || "";

    // Company name similarity (very simple heuristic for now)
    const sameName =
      otherName &&
      (otherName === normalizedName ||
        otherName.includes(normalizedName) ||
        normalizedName.includes(otherName));

    // Same email domain
    const sameDomain = emailDomain && otherDomain && emailDomain === otherDomain;

    // Same phone
    const samePhone = phone && otherPhone && phone === otherPhone;
    
    // EIN match
    if (req.ein && data.ein && req.ein === data.ein) {
      duplicateMatches++;
      flags.push(`Matching EIN with ${otherDoc.id}`);
    }

    // DUNS match
    if (req.duns && data.duns && req.duns === data.duns) {
      duplicateMatches++;
      flags.push(`Matching DUNS with ${otherDoc.id}`);
    }

    if (sameName || sameDomain || samePhone) {
      duplicateMatches += 1;
      if (sameName) flags.push(`Similar company name to request ${otherDoc.id}`);
      if (sameDomain) flags.push(`Same email domain as request ${otherDoc.id}`);
      if (samePhone) flags.push(`Same phone as request ${otherDoc.id}`);
    }
  });

  // 2. Optional: cross-check against "companies" or "users" collections
  // (pseudo-code; uncomment + adapt if you have those collections)
  //
  // const companiesSnap = await adminDb
  //   .collection("companies")
  //   .where("domain", "==", emailDomain)
  //   .get();
  // duplicateMatches += companiesSnap.size;
  // if (companiesSnap.size > 0) {
  //   flags.push(`Existing company documents found for domain ${emailDomain}`);
  // }

  // 3. Compute a simple risk score from 0–100
  let riskScore = 0;
  if (duplicateMatches === 0) riskScore = 10;
  if (duplicateMatches === 1) riskScore = 40;
  if (duplicateMatches === 2) riskScore = 70;
  if (duplicateMatches >= 3) riskScore = 90;

  await ref.set(
    {
      riskScore,
      duplicateMatches,
      flags,
      lastRiskCheckAt: new Date().toISOString(),
    },
    { merge: true }
  );

  return { riskScore, duplicateMatches, flags };
}