import crypto from "crypto";

export function hashConfirmationToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
