import { NextResponse } from "next/server";
import { db } from "@/firebase/server";
import { collection, addDoc } from "firebase/firestore";
import OpenAI from "openai";
import { authUser } from "@/lib/authUser"; // helper that validates current user (returns user object)
import { v4 as uuidv4 } from "uuid";

// Mock external API fetchers (replace with live APIs later)
async function fetchFromClearbit(name: string, email?: string) {
  return {
    source: "Clearbit",
    found: true,
    email,
    riskSignals: ["verified email", "active digital footprint"],
  };
}

async function fetchFromExperian(name: string, address: string) {
  return {
    source: "Experian",
    creditScore: 710,
    flags: [],
    debtToIncome: 0.32,
  };
}

async function fetchFromPlaid(bankToken?: string) {
  return {
    source: "Plaid",
    incomeVerified: true,
    recurringPayments: ["rent", "utilities"],
  };
}

// Merge mock responses into one unified profile
function mergeResults(name: string, results: any[]) {
  const summary: any = {
    name,
    score: 0,
    signals: [],
    details: {},
  };

  results.forEach((r) => {
    summary.details[r.source] = r;
    if (r.source === "Experian" && r.creditScore)
      summary.score += Math.min(100, (r.creditScore / 850) * 100);
    if (r.source === "Clearbit" && r.riskSignals)
      summary.signals.push(...r.riskSignals);
    if (r.source === "Plaid" && r.incomeVerified)
      summary.signals.push("verified income");
  });

  summary.score = Math.round(summary.score / results.length);
  return summary;
}

export async function POST(req: Request) {
  try {
    const user = await authUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const body = await req.json();
    const { name, address, email, licenseNumber, bankToken } = body;

    if (!name || !address)
      return NextResponse.json({ error: "Missing name or address" }, { status: 400 });

    // Step 1: Fetch from mock external APIs
    const [clearbitData, experianData, plaidData] = await Promise.all([
      fetchFromClearbit(name, email),
      fetchFromExperian(name, address),
      fetchFromPlaid(bankToken),
    ]);

    // Step 2: Merge results
    const merged = mergeResults(name, [clearbitData, experianData, plaidData]);

    // Step 3: AI Summary (using OpenAI)
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const aiPrompt = `
    Summarize the following renter verification report into 3 paragraphs:
    Include overall risk level, key findings, and any concerns.

    Data:
    ${JSON.stringify(merged, null, 2)}
    `;

    const aiSummary = await openai.responses.create({
      model: "gpt-4o-mini",
      input: aiPrompt,
    });

    const summaryText = aiSummary.output[0].content[0].text;

    // Step 4: Store in Firestore
    const reportId = uuidv4();
    const docRef = await addDoc(collection(db, "deepReports"), {
      id: reportId,
      userId: user.uid,
      userEmail: user.email,
      renterName: name,
      renterAddress: address,
      renterEmail: email,
      licenseNumber,
      sources: ["Clearbit", "Experian", "Plaid"],
      merged,
      aiSummary: summaryText,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      reportId: docRef.id,
      aiSummary: summaryText,
      merged,
    });
  } catch (err: any) {
    console.error("Error in analyze-deep:", err);
    return NextResponse.json({ error: "Failed to process deep analysis" }, { status: 500 });
  }
}