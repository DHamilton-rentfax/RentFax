"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const fs_1 = __importDefault(require("fs"));
const creds = JSON.parse(Buffer.from(process.env.FIREBASE_ADMIN_CERT_B64, "base64").toString("utf8"));
(0, app_1.initializeApp)({ credential: (0, app_1.cert)(creds) });
const db = (0, firestore_1.getFirestore)();
async function backup() {
    const orgs = await db.collection("orgs").get();
    const data = {};
    for (const org of orgs.docs) {
        const renters = await db.collection(`orgs/${org.id}/renters`).get();
        const disputes = await db.collection(`orgs/${org.id}/disputes`).get();
        data[org.id] = {
            renters: renters.docs.map(d => (Object.assign({ id: d.id }, d.data()))),
            disputes: disputes.docs.map(d => (Object.assign({ id: d.id }, d.data()))),
        };
    }
    fs_1.default.writeFileSync("backup.json", JSON.stringify(data, null, 2));
    console.log("✅ Backup complete");
}
backup();
