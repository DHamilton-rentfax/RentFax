
import { RulesTestEnvironment, RulesTestContext } from "@firebase/rules-unit-testing";
const assert = require("assert");
const firebase = require("@firebase/rules-unit-testing");
const fs = require("fs");

const PROJECT_ID = "rentfax-test";
const rules = fs.readFileSync("firestore.rules", "utf8");

// Mock user roles
const SUPER_ADMIN_AUTH = { uid: "superadmin", token: { role: "SUPER_ADMIN" } };
const COMPANY_AUTH = { uid: "company1", token: { role: "COMPANY" } };
const LANDLORD_AUTH = { uid: "landlord1", token: { role: "LANDLORD" } };
const RENTER_AUTH = { uid: "renter1", token: { role: "RENTER" } };
const LEGAL_AUTH = { uid: "legal1", token: { role: "LEGAL" } };

describe("Firestore Security Rules", () => {
  let testEnv: RulesTestEnvironment;

  before(async () => {
    testEnv = await firebase.initializeTestEnvironment({ 
        projectId: PROJECT_ID,
        firestore: { rules },
    });
  });

  after(async () => {
    await testEnv.cleanup();
  });

  // ------------------------------------------------------------------
  // INCIDENTS
  // ------------------------------------------------------------------
  describe("incidents", () => {
    it("should allow a company to create an incident", async () => {
      const db = testEnv.authenticatedContext(COMPANY_AUTH.uid, COMPANY_AUTH.token).firestore();
      await firebase.assertSucceeds(db.collection("incidents").add({ renterId: "renter1", companyId: "company1", createdBy: "company1", category: "test", details: {} }));
    });

    it("should NOT allow a renter to create an incident", async () => {
        const db = testEnv.authenticatedContext(RENTER_AUTH.uid, RENTER_AUTH.token).firestore();
        await firebase.assertFails(db.collection("incidents").add({ renterId: "renter1", companyId: "company1", createdBy: "renter1", category: "test", details: {} }));
      });

    it("should allow a super admin to read any incident", async () => {
        const db = testEnv.authenticatedContext(SUPER_ADMIN_AUTH.uid, SUPER_ADMIN_AUTH.token).firestore();
        await firebase.assertSucceeds(db.collection("incidents").get());
      });

      it("should allow a renter to read their own incidents", async () => {
        const db = testEnv.authenticatedContext(RENTER_AUTH.uid, RENTER_AUTH.token).firestore();
        await testEnv.withSecurityRulesDisabled(async (context: RulesTestContext) => {
            await context.firestore().collection("incidents").doc("incident1").set({ renterId: RENTER_AUTH.uid });
        });
        await firebase.assertSucceeds(db.collection("incidents").doc("incident1").get());
      });
  });

  // ------------------------------------------------------------------
  // RENTERS
  // ------------------------------------------------------------------
  describe("renters", () => {
    it("should allow a renter to update their own verified status", async () => {
        const db = testEnv.authenticatedContext(RENTER_AUTH.uid, RENTER_AUTH.token).firestore();
        await testEnv.withSecurityRulesDisabled(async (context: RulesTestContext) => {
            await context.firestore().collection("renters").doc(RENTER_AUTH.uid).set({ email: "test@test.com" });
        });
        await firebase.assertSucceeds(db.collection("renters").doc(RENTER_AUTH.uid).update({ verified: true }));
      });

      it("should NOT allow a renter to update their own internal notes", async () => {
        const db = testEnv.authenticatedContext(RENTER_AUTH.uid, RENTER_AUTH.token).firestore();
        await testEnv.withSecurityRulesDisabled(async (context: RulesTestContext) => {
            await context.firestore().collection("renters").doc(RENTER_AUTH.uid).set({ email: "test@test.com" });
        });
        await firebase.assertFails(db.collection("renters").doc(RENTER_AUTH.uid).update({ internalNotes: "test" }));
      });
  });
});
