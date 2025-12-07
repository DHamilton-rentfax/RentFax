import crypto from "crypto";

export function normalizeString(value: string | null | undefined) {
  if (!value) return "";
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function normalizePhone(phone: string | null | undefined) {
  if (!phone) return "";
  return phone.replace(/\D/g, "");
}

export function normalizeEmail(email: string | null | undefined) {
  if (!email) return "";
  return email.trim().toLowerCase();
}

export function hash(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
