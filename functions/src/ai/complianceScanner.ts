import * as admin from "firebase-admin";
import { onObjectFinalized } from "firebase-functions/v2/storage";
import OpenAI from "openai";
import { tmpdir } from "os";
import { join } from "path";
import { readFileSync, unlinkSync } from "fs";
import { getStorage } from "firebase-admin/storage";
import { defineSecret } from "firebase-functions/params";

const db = admin.firestore();
const storage = getStorage();
const openaiApiKey = defineSecret("OPENAI_API_KEY");

export const complianceScanner = onObjectFinalized(
  {
    region: "us-east1",
    memory: "512MiB",
    timeoutSeconds: 120,
    secrets: [openaiApiKey],
  },
  async (event) => {
    const openai = new OpenAI({
      apiKey: openaiApiKey.value(),
    });

    const object = event.data;
    if (!object?.name) return;

    const filePath = object.name;

    // Prevent infinite loop by ignoring already quarantined files
    if (filePath.startsWith("blocked_uploads/")) {
      return console.log(`Skipping already quarantined file: ${filePath}`);
    }

    const bucket = storage.bucket(object.bucket);
    const tempFilePath = join(tmpdir(), filePath.split("/").pop() || "upload.tmp");

    console.log(`🔍 Scanning upload: ${filePath}`);

    // Download file locally
    await bucket.file(filePath).download({ destination: tempFilePath });
    const fileBuffer = readFileSync(tempFilePath);
    const base64 = fileBuffer.toString("base64");

    try {
      // 🧠 Use OpenAI to analyze file content
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are a compliance AI scanner for a rental reporting platform.
Your job is to detect files that may contain HIPAA-protected or sensitive data.

Flag a file as VIOLATION if it contains:
- medical records, diagnoses, prescriptions, test results
- insurance policy details
- patient health data or health provider notes
- SSNs, DOBs, driver’s licenses, credit cards, or banking details

Respond strictly in JSON with { "violation": boolean, "reason": string }.
`,
          },
          {
            role: "user",
            content: `Analyze this file for HIPAA or sensitive information: ${base64}`,
          },
        ],
      });

      const analysis = completion.choices[0]?.message?.content || "{}";
      const result = JSON.parse(analysis);

      if (result.violation === true) {
        console.warn(`🚨 File blocked: ${filePath} (${result.reason})`);

        // Move to quarantine bucket folder
        const quarantinePath = `blocked_uploads/${filePath.split("/").pop()}`;
        await bucket.file(filePath).move(quarantinePath);

        // Log violation
        await db.collection("compliance_violations").add({
          filePath,
          reason: result.reason,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          uploader: object.metadata?.userId || "unknown",
          quarantinedTo: quarantinePath,
        });

        // Optional: send admin notification (add later)
      } else {
        console.log(`✅ File passed compliance scan: ${filePath}`);
      }
    } catch (error) {
      console.error("❌ Error scanning file:", error);
    } finally {
      // Clean up local temp file
      try {
        unlinkSync(tempFilePath);
      } catch {}
    }
  }
);
