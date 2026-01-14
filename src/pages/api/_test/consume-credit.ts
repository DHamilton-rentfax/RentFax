// src/pages/api/_test/consume-credit.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "@/firebase/server";
import { getAuth } from "firebase-admin/auth";
import { FieldValue } from "firebase-admin/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const isTestRequest =
    process.env.NODE_ENV !== "production" && req.headers["x-test-mode"] === "true";

  if (!isTestRequest) return res.status(404).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.slice(7);
    const decoded = await getAuth().verifyIdToken(token);

    const orgId = decoded.orgId;
    if (!orgId) {
      return res.status(400).json({ error: "Missing orgId claim" });
    }

    const orgRef = adminDb.collection("orgs").doc(orgId);
    const ledgerRef = adminDb.collection("ledger").doc(); // single doc ref for this request

    const result = await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(orgRef);
      if (!snap.exists) {
        throw new Error("ORG_NOT_FOUND");
      }

      const credits = snap.data()?.creditsRemaining ?? 0;

      // ✅ If blocked: write ledger + return result (NO THROW => COMMIT)
      if (credits <= 0) {
        tx.set(ledgerRef, {
          action: "CREDIT_BLOCKED_ATTEMPT",
          relatedObject: orgId, // ✅ matches the test query
          createdAt: FieldValue.serverTimestamp(),
        });

        return { ok: false as const };
      }

      // ✅ Consume credit + ledger record
      tx.update(orgRef, { creditsRemaining: credits - 1 });

      tx.set(ledgerRef, {
        action: "CREDIT_CONSUMED",
        relatedObject: orgId, // ✅ matches the test query
        createdAt: FieldValue.serverTimestamp(),
      });

      return { ok: true as const };
    });

    if (!result.ok) {
      return res.status(402).json({ error: "Insufficient credits" });
    }

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error("consume-credit test API error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
