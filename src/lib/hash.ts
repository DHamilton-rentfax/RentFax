// src/lib/hash.ts
import crypto from "crypto";

export function hashValue(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}