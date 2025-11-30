'use client';
import { collection, addDoc, getDoc, doc, query, where, getDocs } from "firebase/firestore";

import { db } from "@/firebase/client";

export async function runIntegrationDiagnostic() {
  console.log("🔍 Running RentFAX ↔ CodeSage integration diagnostic...");

  try {
    // Check environment variable
    const codeSageURL = process.env.NEXT_PUBLIC_CODESAGE_URL;
    if (!codeSageURL) {
      console.warn("⚠️ Missing NEXT_PUBLIC_CODESAGE_URL in environment.");
    } else {
      console.log(`🌐 CodeSage endpoint detected: ${codeSageURL}`);
    }

    // Step 1: Test write to Firestore
    const testDoc = {
      test: true,
      timestamp: new Date().toISOString(),
      source: "diagnostic",
    };

    const integrationTestsCol = collection(db, "integrationTests");
    const ref = await addDoc(integrationTestsCol, testDoc);
    console.log(`✅ Firestore write succeeded: ${ref.id}`);

    // Step 2: Test read
    const docRef = doc(db, "integrationTests", ref.id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      console.log("📄 Firestore read test passed.");
    } else {
      console.error("❌ Firestore read failed.");
    }

    // Step 3: Test webhook (POST request to CodeSage)
    if (codeSageURL) {
      const res = await fetch(`${codeSageURL}/api/webhook/rentfax`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          renterId: "diagnostic-test",
          fileName: "diagnostic-test.js",
          aiIssues: [{ severity: "info", message: "Diagnostic test OK" }],
          quickIssues: [],
        }),
      });

      if (res.ok) {
        console.log("✅ Webhook POST successful.");
        try {
            const json = await res.json();
            console.log("📦 Webhook Response:", json);
        } catch (e) {
            console.log("📦 Webhook response was not JSON, but request was successful.");
        }
      } else {
        console.error(`❌ Webhook POST failed: ${res.status}`);
      }
    } else {
        console.warn("⚠️ Skipping webhook test because NEXT_PUBLIC_CODESAGE_URL is not set.");
    }


    // Step 4: Check Firestore for webhook data
    const auditsCol = collection(db, "rentfaxAudits");
    const q = query(auditsCol, where("renterId", "==", "diagnostic-test"));
    const auditsSnapshot = await getDocs(q);

    if (!auditsSnapshot.empty) {
      console.log(`✅ Webhook data synced in Firestore (${auditsSnapshot.size} record(s) found).`);
    } else {
      console.warn("⚠️ No webhook data found in rentfaxAudits yet. Check webhook logs.");
    }

    console.log("🎯 Integration diagnostic completed.");
  } catch (err: any) {
    console.error("❌ Integration diagnostic failed:", err.message);
    console.error(err.stack);
  }
}
