import crypto from "crypto";

const SECRET = process.env.REPORT_SHARE_SECRET;

export function createShareToken(reportId: string) {
  const payload = JSON.stringify({
    reportId,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  });

  const base = Buffer.from(payload).toString("base64url");
  const sig = crypto
    .createHmac("sha256", SECRET)
    .update(base)
    .digest("base64url");

  return `${base}.${sig}`;
}
