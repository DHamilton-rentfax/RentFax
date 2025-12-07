import { adminDb } from "@/firebase/server";

export async function authenticateApiRequest(req: Request) {
  const apiKey = req.headers.get("x-rentfax-key");
  const apiSecret = req.headers.get("x-rentfax-secret");
  const ip = req.headers.get("x-forwarded-for") || "unknown";

  if (!apiKey || !apiSecret) {
    return { ok: false, error: "Missing API credentials" };
  }

  const match = await adminDb
    .collection("companies")
    .where("apiKeys.publicKey", "==", apiKey)
    .get();

  if (match.empty) {
    return { ok: false, error: "Invalid API Key" };
  }

  const company = match.docs[0].data();
  
  if (company.apiKeys.secretKey !== apiSecret) {
    return { ok: false, error: "Invalid Secret" };
  }

  // IP allowlist check
  if (company.apiKeys.ipAllowlist?.length) {
    if (!company.apiKeys.ipAllowlist.includes(ip)) {
      return { ok: false, error: "IP not allowed" };
    }
  }

  return { ok: true, companyId: match.docs[0].id };
}
