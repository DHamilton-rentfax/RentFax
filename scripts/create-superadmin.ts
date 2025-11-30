
import { auth, db } from "../src/firebase/server";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

async function createSuperAdmin() {
  const email = "info@rentfax.io";
  const password = "password123";

  try {
    // Step 1: Create user in Firebase Authentication
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      emailVerified: true,
    });

    console.log("Successfully created new user:", userRecord.uid);

    // Step 2: Set custom claim for SUPER_ADMIN role
    await auth.setCustomUserClaims(userRecord.uid, { role: 'SUPER_ADMIN' });

    console.log("Successfully set SUPER_ADMIN claim for user:", userRecord.uid);

    // Step 3: Create user document in Firestore
    await setDoc(doc(db, "users", userRecord.uid), {
      email: email,
      role: "SUPER_ADMIN",
      createdAt: new Date().toISOString(),
      provider: "password",
    });

    console.log("Successfully created Firestore document for user:", userRecord.uid);

  } catch (error) {
    console.error("Error creating super admin:", error);
    process.exit(1);
  }
}

createSuperAdmin();
