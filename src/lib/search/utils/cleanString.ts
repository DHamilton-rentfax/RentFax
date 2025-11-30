// src/lib/search/utils/cleanString.ts

export function cleanString(v?: string | null): string | null {
  if (!v) return null;
  const s = v.trim();
  // A simple list of values to treat as null
  const nullEquivalents = ["N/A", "NA", "NULL", "UNDEFINED", ""];
  if (nullEquivalents.includes(s.toUpperCase())) return null;
  return s;
}
