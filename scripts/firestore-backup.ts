import fs from "fs";

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const creds = JSON.parse(Buffer.from(process.env.FIREBASE_ADMIN_CERT_B64!, "base64").toString("utf8"));
initializeApp({ credential: cert(creds) });
const db = getFirestore();

async function backup() {
  const orgs = await db.collection("orgs").get();
  const data: any = {};

  for (const org of orgs.docs) {
    const renters = await db.collection(`orgs/${org.id}/renters`).get();
    const disputes = await db.collection(`orgs/${org.id}/disputes`).get();
    data[org.id] = {
      renters: renters.docs.map(d => ({ id: d.id, ...d.data() })),
      disputes: disputes.docs.map(d => ({ id: d.id, ...d.data() })),
    };
  }

  fs.writeFileSync("backup.json", JSON.stringify(data, null, 2));
  console.log("✅ Backup complete");
}

backup();
