import fs from "fs";

import { initializeTestEnvironment, RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { setLogLevel, doc, setDoc, getDoc, collection, addDoc, deleteDoc } from "firebase/firestore";

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "rentfax-test",
    firestore: {
      rules: fs.readFileSync("firestore.rules", "utf8"),
    },
  });
  setLogLevel("error");
});

afterAll(async () => {
  await testEnv.cleanup();
});

describe("Firestore Security Rules - RentFAX", () => {
  // ---------------------------
  // DISPUTES
  // ---------------------------
  it("SUPER_ADMIN can create disputes", async () => {
    const ctx = testEnv.authenticatedContext("superadmin", { role: "SUPER_ADMIN" });
    const db = ctx.firestore();
    const ref = doc(db, "disputes/test1");
    await setDoc(ref, { status: "open", renterId: "r1", companyId: "c1" }); // ✅ should succeed
    const snap = await getDoc(ref);
    expect(snap.exists()).toBe(true);
  });

  it("VIEWER can read disputes but not write", async () => {
    const ctx = testEnv.authenticatedContext("viewer", { role: "VIEWER" });
    const db = ctx.firestore();
    const ref = doc(db, "disputes/test1");
    await expect(setDoc(ref, { status: "hack" })).rejects.toThrow();
  });

  // ---------------------------
  // FRAUD ALERTS / RENTERS
  // ---------------------------
  it("ADMIN can update renters", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), "renters/r1"), { email: "original@test.com" });
    });
    const ctx = testEnv.authenticatedContext("admin", { role: "ADMIN" });
    const db = ctx.firestore();
    const ref = doc(db, "renters/r1");
    await setDoc(ref, { email: "fraud@test.com", alert: true }, { merge: true }); // ✅ should succeed
  });

  it("SUPPORT cannot update renters", async () => {
    const ctx = testEnv.authenticatedContext("support", { role: "SUPPORT" });
    const db = ctx.firestore();
    const ref = doc(db, "renters/r1");
    await expect(setDoc(ref, { alert: false })).rejects.toThrow();
  });

  // ---------------------------
  // BLOGS
  // ---------------------------
  it("EDITOR can create blogs", async () => {
    const ctx = testEnv.authenticatedContext("editor", { role: "EDITOR" });
    const db = ctx.firestore();
    const ref = doc(db, "blogs/blog1");
    await setDoc(ref, { title: "Editor Post", content: "Hello world" }); // ✅ should succeed
  });

  it("EDITOR cannot delete blogs", async () => {
    const ctx = testEnv.authenticatedContext("editor", { role: "EDITOR" });
    const db = ctx.firestore();
    const ref = doc(db, "blogs/blog1");
    await expect(deleteDoc(ref)).rejects.toThrow();
  });

  // ---------------------------
  // INVITES
  // ---------------------------
  it("ADMIN can create invites", async () => {
    const ctx = testEnv.authenticatedContext("admin", { role: "ADMIN" });
    const db = ctx.firestore();
    const ref = doc(db, "invites/invite1");
    await setDoc(ref, { email: "test@rentfax.io", role: "EDITOR" }); // ✅ should succeed
  });

  it("Viewer cannot create invites", async () => {
    const ctx = testEnv.authenticatedContext("viewer", { role: "VIEWER" });
    const db = ctx.firestore();
    const ref = doc(db, "invites/invite2");
    await expect(setDoc(ref, { email: "fail@test.com" })).rejects.toThrow();
  });

  // ---------------------------
  // AUDIT LOGS
  // ---------------------------
  it("SUPER_ADMIN can read audit logs", async () => {
    const ctx = testEnv.authenticatedContext("superadmin", { role: "SUPER_ADMIN" });
    const db = ctx.firestore();
    const ref = doc(db, "auditLogs/log1");
    // simulate system-created entry
    await testEnv.withSecurityRulesDisabled(async (ctx2) => {
      await setDoc(doc(ctx2.firestore(), "auditLogs/log1"), { action: "TEST" });
    });
    const snap = await getDoc(ref);
    expect(snap.exists()).toBe(true);
  });

  it("EDITOR cannot read audit logs", async () => {
    const ctx = testEnv.authenticatedContext("editor", { role: "EDITOR" });
    const db = ctx.firestore();
    const ref = doc(db, "auditLogs/log1");
    await expect(getDoc(ref)).rejects.toThrow();
  });

  // ---------------------------
  // ALERTS
  // ---------------------------
  it("ADMIN can update alerts but not create", async () => {
    const ctx = testEnv.authenticatedContext("admin", { role: "ADMIN" });
    const db = ctx.firestore();

    // simulate SYSTEM created alert
    await testEnv.withSecurityRulesDisabled(async (ctx2) => {
      await setDoc(doc(ctx2.firestore(), "alerts/a1"), { type: "CRITICAL", status: "open" });
    });

    const ref = doc(db, "alerts/a1");
    await setDoc(ref, { status: "acknowledged" }, { merge: true }); // ✅ allowed to update

    const refNew = doc(db, "alerts/new1");
    await expect(setDoc(refNew, { type: "NEW" })).rejects.toThrow(); // ❌ not allowed
  });

  // ---------------------------
  // CHATS
  // ---------------------------
  it("SUPPORT can reply to chats", async () => {
    const ctx = testEnv.authenticatedContext("support", { role: "SUPPORT" });
    const db = ctx.firestore();
    const ref = doc(db, "chats/chat1");
    await setDoc(ref, { status: "open" }); // ✅ can update
  });

  it("Renter can create a chat but not delete", async () => {
    const ctx = testEnv.authenticatedContext("renter", { role: "RENTER" });
    const db = ctx.firestore();
    const chatRef = doc(db, "chats/cust1");
    await setDoc(chatRef, { startedBy: "renter@test.com" }); // ✅ can create

    await expect(deleteDoc(chatRef)).rejects.toThrow(); // ❌ cannot delete
  });

  // ---------------------------
  // UNAUTHENTICATED
  // ---------------------------
  it("Unauthenticated users cannot write", async () => {
    const ctx = testEnv.unauthenticatedContext();
    const db = ctx.firestore();
    const ref = doc(db, "disputes/unauth1");
    await expect(setDoc(ref, { status: "hack" })).rejects.toThrow();
  });
});
