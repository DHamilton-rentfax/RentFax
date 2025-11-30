import crypto from "crypto";

export function normalize(str: string) {
  return (str || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export function generateIdentityHash(input: {
  fullName: string;
  dob?: string;
  licenseNumber?: string;
  nationality?: string;
  emails?: string[];
  phones?: string[];
}) {
  const data = [
    normalize(input.fullName),
    normalize(input.dob || ""),
    normalize(input.licenseNumber || ""),
    normalize(input.nationality || ""),
    ...(input.emails || []).map(normalize),
    ...(input.phones || []).map(normalize),
  ].join("|");

  return crypto.createHash("sha256").update(data).digest("hex");
}
