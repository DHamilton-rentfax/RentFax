import * as functions from "firebase-functions";
import { makeHash } from "./utils/hash";
import { anchorHashOnChain } from "./anchor";
import { getFirestore } from "firebase-admin/firestore";

const db = getFirestore();

exports.anchorIncident = functions.firestore
  .document("incidents/{incidentId}")
  .onWrite(async (change, context) => {

    const incidentId = context.params.incidentId;
    const after = change.after.data();

    if (!after) return;

    const hash = makeHash({
      incidentId,
      renterId: after.renterId,
      amount_claimed: after.amount_claimed,
      amount_paid: after.amount_paid,
      status: after.status,
      updatedAt: after.updatedAt?.toMillis()
    });

    const txHash = await anchorHashOnChain(hash);

    await db.collection("blockchain_anchors").add({
      type: "incident",
      incidentId,
      renterId: after.renterId,
      hash,
      txHash,
      chain: "polygon",
      createdAt: new Date()
    });
  });
