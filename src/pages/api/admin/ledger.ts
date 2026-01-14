import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "@/firebase/server";
import { Timestamp } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = await getAuth().verifyIdToken(token);

    if (decoded.role !== "ADMIN" && decoded.role !== "SUPER_ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const {
      actorId,
      action,
      relatedObject,
      startDate,
      endDate,
      limit = 25,
      cursor,
    } = req.body;

    const safeLimit = Math.min(Number(limit) || 25, 100);

    let q: FirebaseFirestore.Query = adminDb
      .collection("ledger")
      .orderBy("createdAt", "desc")
      .limit(safeLimit);

    if (actorId) q = q.where("actorId", "==", actorId);
    if (action) q = q.where("action", "==", action);
    if (relatedObject) q = q.where("relatedObject", "==", relatedObject);
    if (startDate) q = q.where("createdAt", ">=", Timestamp.fromDate(new Date(startDate)));
    if (endDate) q = q.where("createdAt", "<=", Timestamp.fromDate(new Date(endDate)));

    if (cursor) {
      const cursorSnap = await adminDb.collection("ledger").doc(cursor).get();
      if (cursorSnap.exists) q = q.startAfter(cursorSnap);
    }

    const snap = await q.get();

    return res.status(200).json({
      entries: snap.docs.map((d) => ({ id: d.id, ...d.data() })),
      nextCursor: snap.docs.at(-1)?.id ?? null,
    });
  } catch (err) {
    console.error("Ledger query error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
