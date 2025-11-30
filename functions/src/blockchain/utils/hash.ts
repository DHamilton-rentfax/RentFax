import * as crypto from "crypto";

export function makeHash(input: Record<string, any>): string {
  const json = JSON.stringify(input, Object.keys(input).sort());
  return crypto.createHash("sha256").update(json).digest("hex");
}
