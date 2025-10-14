"use strict";
/**
 * scripts/makeSuperAdmin.ts
 *
 * Usage:
 *   ts-node scripts/makeSuperAdmin.ts <FIREBASE_UID>
 */
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("firebase-admin/app");
const auth_1 = require("firebase-admin/auth");
if (!(0, app_1.getApps)().length) {
    (0, app_1.initializeApp)({
        credential: (0, app_1.cert)({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: (_a = process.env.FIREBASE_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, "\n"),
        }),
    });
}
async function makeSuperAdmin(uid) {
    try {
        await (0, auth_1.getAuth)().setCustomUserClaims(uid, { role: "super_admin" });
        console.log(`✅ Success: User ${uid} is now a Super Admin.`);
        process.exit(0);
    }
    catch (err) {
        console.error("❌ Failed to assign Super Admin:", err);
        process.exit(1);
    }
}
const uid = process.argv[2];
if (!uid) {
    console.error("❌ Please provide a Firebase UID.\nUsage: ts-node scripts/makeSuperAdmin.ts <UID>");
    process.exit(1);
}
makeSuperAdmin(uid);
