import { NextResponse } from "next/server";
import { adminDb, adminStorage } from "@/firebase/server";
import vision from "@google-cloud/vision";
import * as faceapi from "@vladmandic/face-api/dist/face-api.node.js";
import * as tf from "@tensorflow/tfjs-node";
import fetch from "node-fetch";

export const runtime = "nodejs";

// ============================
// LOAD FACE MODELS (ONCE)
// ============================
let modelsLoaded = false;

async function loadFaceModels() {
  if (modelsLoaded) return;

  const MODEL_URL = process.cwd() + "/models"; // You must upload models folder later

  await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL);

  modelsLoaded = true;
}


// ============================
// AI OCR + FACE MATCH
// ============================

export async function POST(req: Request) {
  try {
    await loadFaceModels();

    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Missing verification token." },
        { status: 400 }
      );
    }

    // ------------------------------------------------------
    // 1. Fetch verification record
    // ------------------------------------------------------
    const ref = adminDb.collection("identityVerifications").doc(token);
    const snap = await ref.get();

    if (!snap.exists) {
      return NextResponse.json(
        { error: "Invalid verification token." },
        { status: 404 }
      );
    }

    const data = snap.data();

    const frontUrl = data.frontIdUrl;
    const backUrl = data.backIdUrl;
    const selfieUrl = data.selfieUrl;

    if (!frontUrl || !selfieUrl) {
      return NextResponse.json(
        { error: "Missing required documents (front ID + selfie required)." },
        { status: 400 }
      );
    }

    // ------------------------------------------------------
    // 2. OCR Extraction
    // ------------------------------------------------------
    const visionClient = new vision.ImageAnnotatorClient();

    const [ocrResult] = await visionClient.textDetection(frontUrl);
    const text = ocrResult.fullTextAnnotation?.text || "";

    // Light parsing (enhance later)
    const extracted = {
      name: text.match(/([A-Z][a-z]+ [A-Z][a-z]+)/)?.[0] || null,
      dob: text.match(/\b\d{2}\/\d{2}\/\d{4}\b/)?.[0] || null,
      licenseNumber:
        text.match(/[A-Z0-9]{6,12}/)?.[0] || null,
    };

    // ------------------------------------------------------
    // 3. FACE MATCHING
    // ------------------------------------------------------

    async function fetchImageBuffer(url: string) {
      const imgRes = await fetch(url);
      return Buffer.from(await imgRes.arrayBuffer());
    }

    const frontImg = await fetchImageBuffer(frontUrl);
    const selfieImg = await fetchImageBuffer(selfieUrl);

    const tensorFront = tf.node.decodeImage(frontImg, 3);
    const tensorSelfie = tf.node.decodeImage(selfieImg, 3);

    const detectionFront = await faceapi.detectSingleFace(tensorFront).withFaceLandmarks().withFaceDescriptor();
    const detectionSelfie = await faceapi.detectSingleFace(tensorSelfie).withFaceLandmarks().withFaceDescriptor();

    if (!detectionFront || !detectionSelfie) {
      return NextResponse.json(
        { error: "Unable to detect face in ID or selfie." },
        { status: 400 }
      );
    }

    const distance = faceapi.euclideanDistance(
      detectionFront.descriptor,
      detectionSelfie.descriptor
    );

    const similarityScore = Math.round((1 - distance) * 100);

    // ------------------------------------------------------
    // 4. Identity Confidence Score
    // ------------------------------------------------------

    const identityScore = (() => {
      let score = 0;

      if (similarityScore >= 85) score += 60;
      else if (similarityScore >= 70) score += 40;
      else score += 15;

      if (extracted.name) score += 15;
      if (extracted.dob) score += 10;
      if (extracted.licenseNumber) score += 15;

      return Math.min(score, 100);
    })();

    // ------------------------------------------------------
    // 5. Fraud Signals
    // ------------------------------------------------------

    const fraudSignals = [];

    if (similarityScore < 60) fraudSignals.push("Face mismatch");
    if (!extracted.name) fraudSignals.push("No name extracted");
    if (!extracted.dob) fraudSignals.push("No DOB extracted");

    // ------------------------------------------------------
    // 6. Verification Result
    // ------------------------------------------------------

    const shouldAutoVerify = identityScore >= 85 && fraudSignals.length === 0;

    await ref.update({
      aiExtracted: extracted,
      faceSimilarity: similarityScore,
      identityScore,
      fraudSignals,
      status: shouldAutoVerify ? "verified" : "requires_review",
      reviewedAt: null,
      aiCompletedAt: Date.now(),
    });

    return NextResponse.json({
      success: true,
      identityScore,
      faceSimilarity: similarityScore,
      fraudSignals,
      extracted,
      autoVerified: shouldAutoVerify,
    });
} catch (err: any) {
    console.error("AI PROCESS ERROR:", err);
    return NextResponse.json(
      { error: "AI verification failed." },
      { status: 500 }
    );
  }
}
