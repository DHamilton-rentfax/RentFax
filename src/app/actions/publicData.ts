import { db } from "@/lib/firebase/server";
import { CourtRecord, AddressEntry, PhoneValidation, EmailValidation } from "./types";

const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// CourtListener: returns public civil cases for a name
export async function getCourtRecordsFromPublic(input: {
  fullName: string;
  city?: string;
  state?: string;
}): Promise<CourtRecord[]> {
  const cacheKey = `court_records_${input.fullName.toLowerCase().replace(/\s/g, '_')}`;
  const cached = await getCachedPublicData(cacheKey);
  if (cached) {
    return cached.profile.records;
  }

  try {
    const query = encodeURIComponent(input.fullName);
    const url = `https://www.courtlistener.com/api/rest/v3/search/?q=${query}&type=docket`;
    
    const res = await fetch(url);
    if (!res.ok) return [];

    const data = await res.json();

    if (!data.results || data.results.length === 0) return [];

    const records = data.results.map((rec: any) => ({
      id: rec.id?.toString(),
      caseNumber: rec.caseName || "Unknown Case",
      courtName: rec.court || "Unknown Court",
      type: "CIVIL_JUDGMENT",
      filingDate: rec.dateFiled || null,
      status: rec.opinionStatus || null,
      amountClaimed: null,
      url: rec.absolute_url
        ? `https://www.courtlistener.com${rec.absolute_url}`
        : undefined,
    }));

    await cachePublicData(cacheKey, { records });
    return records;
  } catch (err) {
    console.error("CourtListener error:", err);
    return [];
  }
}

export async function getAddressHistoryFromPublic(input: {
  fullName: string;
  email?: string;
  phone?: string;
}): Promise<AddressEntry[]> {
  // No caching for this mock function
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

export async function validatePhonePublic(phone?: string): Promise<PhoneValidation | undefined> {
  if (!phone) return;
  
  const cacheKey = `phone_${phone}`;
  const cached = await getCachedPublicData(cacheKey);
  if (cached) {
    return cached.profile.validation;
  }

  try {
    const apiKey = process.env.ABSTRACT_PHONE_API_KEY;
    const res = await fetch(`https://phonevalidation.abstractapi.com/v1/?api_key=${apiKey}&phone=${phone}`);

    if (!res.ok) return { phone, valid: false, risk: "high" };

    const data = await res.json();

    const validation = {
      phone,
      valid: data.valid,
      lineType: data.line_type || "unknown",
      carrier: data.carrier,
      risk: data.valid ? "low" : "high",
    };
    
    await cachePublicData(cacheKey, { validation });
    return validation;

  } catch {
    return { phone, valid: false, risk: "medium" };
  }
}

export async function validateEmailPublic(email?: string): Promise<EmailValidation | undefined> {
  if (!email) return;

  const cacheKey = `email_${email}`;
  const cached = await getCachedPublicData(cacheKey);
  if (cached) {
    return cached.profile.validation;
  }

  try {
    const apiKey = process.env.ABSTRACT_EMAIL_API_KEY;
    const res = await fetch(`https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${email}`);

    if (!res.ok) return { email, valid: false, risk: "high" };

    const data = await res.json();

    const validation = {
      email,
      valid: data.deliverability === "DELIVERABLE",
      disposable: data.is_disposable_email?.value || false,
      risk: data.deliverability === "DELIVERABLE" ? "low" : "medium",
    };

    await cachePublicData(cacheKey, { validation });
    return validation;

  } catch {
    return { email, valid: false, disposable: false, risk: "medium" };
  }
}

async function cachePublicData(searchKey: string, profile: any) {
  const ref = db.collection("publicCache").doc(searchKey);
  await ref.set({
    profile,
    cachedAt: new Date(),
  });
}

async function getCachedPublicData(searchKey: string) {
  const ref = db.collection("publicCache").doc(searchKey);
  const snap = await ref.get();
  if (snap.exists && (Date.now() - snap.data().cachedAt.toMillis()) < CACHE_DURATION_MS) {
    return snap.data();
  } 
  return null;
}

