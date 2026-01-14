import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "@/firebase/server";
import { Timestamp } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

/**
 * Escapes values for RFC 4180–compliant CSV output.
 * - Converts null/undefined to empty string
 * - Escapes quotes by doubling
 * - Wraps all values in quotes
 */
function csvEscape(value: unknown): string {
  const s = value == null ? "" : String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  /* ===============================
     METHOD GUARD
  =============================== */
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    /* ===============================
       AUTH / ROLE ENFORCEMENT
    =============================== */

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.slice("Bearer ".length);
    const decoded = await getAuth().verifyIdToken(token);

    if (decoded.role !== "ADMIN" && decoded.role !== "SUPER_ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }

    /* ===============================
       INPUT (DEFENSIVE)
    =============================== */

    const {
      actorId,
      action,
      relatedObject,
      startDate,
      endDate,
    } = req.body ?? {};

    let query: FirebaseFirestore.Query = adminDb
      .collection("ledger")
      .orderBy("createdAt", "desc");

    if (typeof actorId === "string" && actorId.trim()) {
      query = query.where("actorId", "==", actorId.trim());
    }

    if (typeof action === "string" && action.trim()) {
      query = query.where("action", "==", action.trim());
    }

    if (typeof relatedObject === "string" && relatedObject.trim()) {
      query = query.where("relatedObject", "==", relatedObject.trim());
    }

    if (startDate) {
      const d = new Date(startDate);
      if (!isNaN(d.getTime())) {
        query = query.where("createdAt", ">=", Timestamp.fromDate(d));
      }
    }

    if (endDate) {
      const d = new Date(endDate);
      if (!isNaN(d.getTime())) {
        query = query.where("createdAt", "<=", Timestamp.fromDate(d));
      }
    }

    /* ===============================
       SAFETY LIMIT
    =============================== */

    const MAX_EXPORT_ROWS = 10_000;
    query = query.limit(MAX_EXPORT_ROWS);

    /* ===============================
       QUERY
    =============================== */

    const snap = await query.get();

    /* ===============================
       CSV BUILD
    =============================== */

    const HEADER = [
      "createdAt",
      "action",
      "actorId",
      "actorType",
      "amount",
      "reason",
      "relatedObject",
    ] as const;

    const lines: string[] = [];
    lines.push(HEADER.join(","));

    for (const doc of snap.docs) {
      const row = doc.data() as Record<string, unknown>;
      lines.push(
        HEADER.map((field) => csvEscape(row[field])).join(",")
      );
    }

    const csv = lines.join("\n");

    /* ===============================
       RESPONSE
    =============================== */

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=ledger-export.csv"
    );
    res.setHeader("Cache-Control", "no-store");

    return res.status(200).send(csv);
  } catch (err) {
    console.error("Ledger export API error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
