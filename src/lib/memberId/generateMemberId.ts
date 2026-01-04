import crypto from "crypto";

export function generateMemberId(region = "RFX"): string {
  const random = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `${region}-${random}`;
}
