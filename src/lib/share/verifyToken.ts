import crypto from "crypto";

const SECRET = process.env.REPORT_SHARE_SECRET;

export function verifyShareToken(token: string) {
  const [base, sig] = token.split(".");

  const expectedSig = crypto
    .createHmac("sha256", SECRET)
    .update(base)
    .digest("base64url");

  if (sig !== expectedSig) return null;

  const payload = JSON.parse(
    Buffer.from(base, "base64url").toString()
  );

  if (Date.now() > payload.exp) return null;

  return payload; // { reportId, exp }
}
