import crypto from "crypto";

export function normalizeLicense(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

export function hashLicense(licenseNumber: string) {
  const normalized = normalizeLicense(licenseNumber);
  return crypto.createHash("sha256").update(normalized).digest("hex");
}
