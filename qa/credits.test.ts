/// <reference types="jest" />

import admin from "firebase-admin";
import fetch from "node-fetch";
import { getOrgMemberToken } from "./utils/tokens";

/* =========================================================
   JEST CONFIG
========================================================= */

jest.setTimeout(30_000);

/* =========================================================
   FIREBASE ADMIN INIT (JEST SAFE)
========================================================= */

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();

/* =========================================================
   CONFIG
========================================================= */

// ✅ TEST-ONLY endpoint (no validation, no renter logic)
const CREDIT_CONSUMING_ENDPOINT =
  "http://localhost:4000/api/_test/consume-credit";

/* =========================================================
   TEST SUITE
========================================================= */

describe("Credit Exhaustion System", () => {
  let orgId: string;
  let token: string;

  /* -------------------------------------------------------
     SETUP
  -------------------------------------------------------- */

  beforeAll(async () => {
    // Create org with EXACTLY 1 credit
    const orgRef = await db.collection("orgs").add({
      name: `test-org-${Date.now()}`,
      creditsRemaining: 1,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    orgId = orgRef.id;

    // Generate user token bound to org
    token = await getOrgMemberToken(orgId);
  });

  /* -------------------------------------------------------
     TEARDOWN
  -------------------------------------------------------- */

  afterAll(async () => {
    if (orgId) {
      await db.collection("orgs").doc(orgId).delete();
    }
  });

  /* -------------------------------------------------------
     TEST
  -------------------------------------------------------- */

  it("consumes the first credit and blocks subsequent usage", async () => {
    /* ===============================
       FIRST CALL — SHOULD SUCCEED
    =============================== */

    const res1 = await fetch(CREDIT_CONSUMING_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "x-test-mode": "true", // 🔑 REQUIRED
      },
    });

    if (res1.status !== 200) {
      const text = await res1.text();
      throw new Error(`First call failed: ${res1.status} ${text}`);
    }

    // Credit must decrement
    const orgAfterFirst = await db.collection("orgs").doc(orgId).get();
    expect(orgAfterFirst.data()?.creditsRemaining).toBe(0);

    /* ===============================
       SECOND CALL — SHOULD BLOCK
    =============================== */

    const res2 = await fetch(CREDIT_CONSUMING_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "x-test-mode": "true",
      },
    });

    expect(res2.status).toBe(402);

    // Credit must remain zero
    const orgAfterSecond = await db.collection("orgs").doc(orgId).get();
    expect(orgAfterSecond.data()?.creditsRemaining).toBe(0);

    /* ===============================
       LEDGER ASSERTIONS
    =============================== */

    const ledgerSnap = await db
      .collection("ledger")
      .where("relatedObject", "==", orgId)
      .orderBy("createdAt", "desc")
      .limit(10)
      .get();

    const actions = ledgerSnap.docs.map((d) => d.data().action);

    expect(actions).toContain("CREDIT_CONSUMED");
    expect(actions).toContain("CREDIT_BLOCKED_ATTEMPT");
  });
});
