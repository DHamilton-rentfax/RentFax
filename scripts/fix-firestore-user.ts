
import { adminDb } from "../src/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

async function fixFirestoreUser() {
  console.log("Starting to fix Firestore users...");
  try {
    // Deleting old, incorrect user documents
    console.log("Deleting user: L39fRV85YXckhBp5ItkUTRHCdmn2");
    await adminDb.collection("users").doc("L39fRV85YXckhBp5ItkUTRHCdmn2").delete();
    console.log("Deleted user: L39fRV85YXckhBp5ItkUTRHCdmn2 successfully.");

    console.log("Deleting user: auth_uid_superadmin_01");
    await adminDb.collection("users").doc("auth_uid_superadmin_01").delete();
    console.log("Deleted user: auth_uid_superadmin_01 successfully.");

    // Creating the correct user document
    const uid = "fp0mKFHMfbfNjLao5pzK4fgo4od2";
    console.log(`Creating user document for UID: ${uid}`);
    const userRef = adminDb.collection("users").doc(uid);
    await userRef.set({
      email: "info@rentfax.io",
      name: "Super Admin",
      role: "SUPER_ADMIN",
      companyId: "rentfax-main",
      status: "active",
      createdAt: FieldValue.serverTimestamp(),
    });
    console.log(`Successfully created user document for UID: ${uid}`);
    console.log("Firestore user fix complete.");

  } catch (error) {
    console.error("Error during Firestore user fix:", error);
    process.exit(1);
  }
}

fixFirestoreUser();
