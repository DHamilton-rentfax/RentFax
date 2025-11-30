import crypto from "crypto";

export function hashLicense(license: string | null | undefined) {
  if (!license) return null;
  return crypto.createHash("sha256").update(license.trim().toUpperCase()).digest("hex");
}

export function normalizeSearchPayload(body: any) {
  return {
    fullName: body.fullName.trim(),
    email: body.email?.trim() || null,
    phone: body.phone?.trim() || null,
    address: body.address?.trim() || null,
    state: body.state || null,
    city: body.city || null,
    postalCode: body.postalCode || null,
    country: body.country || "US",
    licenseNumber: body.licenseNumber?.trim() || null,
  };
}

export function buildIdentityKey(normalized: any) {
  const parts = [
    normalized.fullName.toLowerCase(),
    normalized.email?.toLowerCase() || "",
    normalized.phone?.replace(/\D/g, "") || "",
    normalized.postalCode || "",
  ];
  return crypto.createHash("sha256").update(parts.join("|")).digest("hex");
}
