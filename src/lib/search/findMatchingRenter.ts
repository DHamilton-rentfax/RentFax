// src/lib/search/findMatchingRenter.ts

import { adminDb } from "@/firebase/server";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

import { similarity } from "./utils/similarity";
import { normalizePhone } from "./utils/normalizePhone";
import { normalizeEmail } from "./utils/normalizeEmail";

// ------------------------------------
// MATCH WEIGHTS
// ------------------------------------
const WEIGHTS = {
  email: 40,
  phone: 35,
  name: 25,
  address: 10,
  dob: 10,
  license: 15,
};

// Minimum confidence required for a match
const MATCH_THRESHOLD = 50;

// ------------------------------------
// MAIN FUNCTION
// ------------------------------------
export async function findMatchingRenter(parsed: {
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  dob?: string | null;
  address?: {
    raw?: string | null;
    city?: string | null;
    state?: string | null;
    zip?: string | null;
  };
  license?: {
    number?: string | null;
  };
}) {
  const rentersRef = collection(db, "renters");

  // We will query using all available hard fields
  const possibleQueries = [];

  if (parsed.email) possibleQueries.push(["email", "==", parsed.email]);
  if (parsed.phone) possibleQueries.push(["phone", "==", parsed.phone]);
  if (parsed.license?.number)
    possibleQueries.push(["licenseNumber", "==", parsed.license.number]);
  if (parsed.dob) possibleQueries.push(["dob", "==", parsed.dob]);

  let candidates = new Map<string, any>();

  // ------------------------------------
  // 1. HARD MATCHING (Exact matches)
  // ------------------------------------
  for (const qset of possibleQueries) {
    const q = query(rentersRef, where(qset[0], qset[1], qset[2]));
    const snap = await getDocs(q);
    snap.forEach((docSnap) => {
      candidates.set(docSnap.id, { id: docSnap.id, ...docSnap.data() });
    });
  }

  // If nothing came back from hard matching → fetch all renters (fallback)
  // You can later optimize by adding Firestore composite indexes.
  if (candidates.size === 0) {
    const snap = await getDocs(rentersRef);
    snap.forEach((d) => candidates.set(d.id, { id: d.id, ...d.data() }));
  }

  // ------------------------------------
  // 2. SOFT MATCHING (Scoring)
  // ------------------------------------
  const scored = [];

  for (const [, renter] of candidates) {
    let score = 0;

    // email
    if (parsed.email && renter.email) {
      if (parsed.email === renter.email) score += WEIGHTS.email;
    }

    // phone
    if (parsed.phone && renter.phone) {
      if (parsed.phone === renter.phone) score += WEIGHTS.phone;
    }

    // name fuzziness
    if (parsed.fullName && renter.fullName) {
      score += similarity(parsed.fullName, renter.fullName) * WEIGHTS.name;
    }

    // address fuzziness
    if (parsed.address?.raw && renter.address?.raw) {
      score += similarity(parsed.address.raw, renter.address.raw) * WEIGHTS.address;
    }

    // DOB
    if (parsed.dob && renter.dob && parsed.dob === renter.dob) {
      score += WEIGHTS.dob;
    }

    // license number
    if (
      parsed.license?.number &&
      renter.licenseNumber &&
      parsed.license.number === renter.licenseNumber
    ) {
      score += WEIGHTS.license;
    }

    scored.push({ renter, score: Math.round(score) });
  }

  // ------------------------------------
  // 3. Choose best match
  // ------------------------------------
  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];

  if (!best || best.score < MATCH_THRESHOLD) {
    return { match: null, confidence: 0, incidents: [] };
  }

  // ------------------------------------
  // 4. Fetch linked incidents
  // ------------------------------------
  const incidentRef = collection(
    db,
    `renters/${best.renter.id}/incidents`
  );
  const incidentSnap = await getDocs(incidentRef);

  const incidents = [];
  incidentSnap.forEach((d) => incidents.push({ id: d.id, ...d.data() }));

  return {
    match: best.renter,
    confidence: best.score,
    incidents,
  };
}
