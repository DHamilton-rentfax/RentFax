import { getAuth } from "firebase-admin/auth";
import { initializeApp, cert } from "firebase-admin/app";

// Make sure to set these environment variables in your .env.local file
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\n/g, "\n"),
};

if (!serviceAccount.privateKey) {
    throw new Error("Firebase Admin private key is not set in environment variables.");
}

initializeApp({ credential: cert(serviceAccount) });

async function setSuperAdminRole() {
  const email = "info@rentfax.io";
  try {
    const user = await getAuth().getUserByEmail(email);
    await getAuth().setCustomUserClaims(user.uid, {
      role: "SUPER_ADMIN",
      companyId: "rentfax",
    });
    console.log(`✅ Custom claims set for ${email}. They are now a SUPER_ADMIN.`);
  } catch (error) {
    console.error(`❌ Could not find user with email ${email} or failed to set claims.`, error);
  }
}

setSuperAdminRole();
