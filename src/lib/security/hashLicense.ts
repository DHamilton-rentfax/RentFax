import crypto from "crypto";

const LICENSE_SALT = process.env.LICENSE_HASH_SALT || "rentfax-license-v1";

export function normalizeLicense(input: string) {
  return input
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .trim();
}

export function hashLicense(license: string) {
  const normalized = normalizeLicense(license);
  return crypto
    .createHash("sha256")
    .update(normalized + LICENSE_SALT)
    .digest("hex");
}
