import crypto from "crypto";

const SECRET = process.env.MEMBER_ID_APPROVAL_SECRET!;

if (!SECRET) {
  throw new Error("MEMBER_ID_APPROVAL_SECRET is not set in environment variables");
}

export function generateApprovalToken(requestId: string) {
  return crypto
    .createHmac("sha256", SECRET)
    .update(requestId)
    .digest("hex");
}

export function verifyApprovalToken(
  requestId: string,
  token: string
): boolean {
  try {
    const expected = generateApprovalToken(requestId);
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(token)
    );
  } catch (error) {
    return false;
  }
}