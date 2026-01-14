// src/lib/formatPhone.ts

export function formatPhone(value: string): string {
  if (!value) return "";

  const digits = value.replace(/\D/g, "").slice(0, 10);
  const len = digits.length;

  if (len < 4) return digits;
  if (len < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}
