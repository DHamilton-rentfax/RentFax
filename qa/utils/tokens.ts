import admin from "firebase-admin";
import fetch from "node-fetch";

/* =========================================================
   FIREBASE ADMIN INIT (JEST SAFE)
========================================================= */

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const adminAuth = admin.auth();

/* =========================================================
   ENV
========================================================= */

const FIREBASE_API_KEY =
  process.env.FIREBASE_API_KEY ||
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

if (!FIREBASE_API_KEY) {
  throw new Error(
    "FIREBASE_API_KEY or NEXT_PUBLIC_FIREBASE_API_KEY must be set to run integration tests"
  );
}

const FIREBASE_AUTH_EMULATOR_HOST = process.env.FIREBASE_AUTH_EMULATOR_HOST;

/* =========================================================
   TOKEN EXCHANGE (CUSTOM → ID TOKEN)
========================================================= */

async function exchangeCustomTokenForIdToken(
  customToken: string
): Promise<string> {
  const identityToolkitUrl = FIREBASE_AUTH_EMULATOR_HOST
    ? `http://${FIREBASE_AUTH_EMULATOR_HOST}/identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${FIREBASE_API_KEY}`
    : `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${FIREBASE_API_KEY}`;

  const res = await fetch(
    identityToolkitUrl,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: customToken,
        returnSecureToken: true,
      }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed: ${text}`);
  }

  const data = (await res.json()) as { idToken: string };
  return data.idToken;
}

/* =========================================================
   CORE TOKEN BUILDER
========================================================= */

type TokenOptions = {
  role?: "ADMIN" | "SUPER_ADMIN";
  orgId?: string;
};

async function getToken(
  options: TokenOptions = {}
): Promise<string> {
  const user = await adminAuth.createUser({
    email: `test-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}@example.com`,
    password: "Password123!",
  });

  const claims: Record<string, unknown> = {};

  if (options.role) claims.role = options.role;
  if (options.orgId) claims.orgId = options.orgId;

  if (Object.keys(claims).length > 0) {
    await adminAuth.setCustomUserClaims(user.uid, claims);
  }

  const customToken = await adminAuth.createCustomToken(user.uid);

  // Convert → real Firebase ID token
  return exchangeCustomTokenForIdToken(customToken);
}

/* =========================================================
   PUBLIC TEST HELPERS
========================================================= */

/** Admin token (no org binding) */
export async function getAdminToken(): Promise<string> {
  return getToken({ role: "ADMIN" });
}

/** Standard user token */
export async function getUserToken(): Promise<string> {
  return getToken();
}

/** User token bound to a specific organization */
export async function getOrgMemberToken(
  orgId: string
): Promise<string> {
  return getToken({ orgId });
}

/** Admin token bound to a specific organization */
export async function getAdminOrgToken(
  orgId: string
): Promise<string> {
  return getToken({ role: "ADMIN", orgId });
}
