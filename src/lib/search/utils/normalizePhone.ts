// src/lib/search/utils/normalizePhone.ts
import { cleanString } from './cleanString';

export function normalizePhone(v?: string | null): string | null {
  const cleaned = cleanString(v);
  if (!cleaned) return null;

  // Remove all non-digit characters
  const digits = cleaned.replace(/\D/g, "");

  // Basic validation for US-like phone numbers
  if (digits.length >= 10) {
    // Return the last 10 digits to standardize (e.g., remove country code)
    return digits.slice(-10);
  }

  return null; // Return null if it's not a plausible number
}
