import * as functions from "firebase-functions";
import { anchorHashOnChain } from "./anchor";
import { buildEvidenceHash } from "./utils/evidenceHash";
import { buildReportHash } from "./utils/reportHash";
import { getFirestore } from "firebase-admin/firestore";

const db = getFirestore();

// Anchor evidence uploads
exports.anchorEvidence = functions.firestore
  .document("evidence/{evidenceId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const hash = buildEvidenceHash(data);
    const tx = await anchorHashOnChain(hash);

    await db.collection("blockchain_anchors").add({
      type: "evidence",
      evidenceId: context.params.evidenceId,
      hash,
      txHash: tx,
      createdAt: new Date(),
      chain: "polygon"
    });
  });

// Anchor full reports
exports.anchorReport = functions.firestore
  .document("reports/{reportId}")
  .onCreate(async (snap, ctx) => {
    const data = snap.data();
    const hash = buildReportHash(data);
    const tx = await anchorHashOnChain(hash);

    await db.collection("blockchain_anchors").add({
      type: "report",
      reportId: ctx.params.reportId,
      hash,
      txHash: tx,
      createdAt: new Date(),
      chain: "polygon"
    });
  });
