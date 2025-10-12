
import { NextResponse } from "next/server";
import { adminDB } from "@/lib/firebase-admin";
import { OpenAI } from "openai";
import { authUser } from "@/lib/authUser";
import { v4 as uuidv4 } from "uuid";
import { FieldValue } from "firebase-admin/firestore";

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
    const isInternalRequest = req.headers.get('X-Internal-Request') === 'true';
    let userId, userEmail;
    const body = await req.json(); // Moved this up to access it earlier

    if (isInternalRequest) {
        userId = body.userId;
        const userRecord = await adminDB.collection('users').doc(userId).get();
        if (!userRecord.exists) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        userEmail = userRecord.data()?.email;
    } else {
        const user = await authUser(req);
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        userId = user.uid;
        userEmail = user.email;

        const userRef = adminDB.collection("users").doc(userId);
        const userDoc = await userRef.get();
        const userData = userDoc.data();

        if (!userData) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { deepReportCredits, activePlan } = userData;

        if ((!deepReportCredits || deepReportCredits <= 0) && activePlan === 'plan_free') {
                return NextResponse.json({ error: "You have no deep report credits left. Please purchase more." }, { status: 402 });
        }

        if (activePlan !== 'plan_free') {
          await userRef.update({ deepReportCredits: FieldValue.increment(-1) });
        }
    }

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

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: aiPrompt }],
      });
  
    const summaryText = completion.choices[0].message.content;

    // Step 4: Store in Firestore
    const reportId = uuidv4();
    const reportRef = await adminDB.collection("deepReports").add({
      id: reportId,
      userId: userId,
      userEmail: userEmail,
      renterName: name,
      renterAddress: address,
      renterEmail: email,
      licenseNumber,
      sources: ["Clearbit", "Experian", "Plaid"],
      merged,
      aiSummary: summaryText,
      createdAt: new Date().toISOString(),
      reportStatus: 'fresh',
    });

    // Step 5: Send Notification
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userId,
        email: userEmail,
        type: "deepReport",
        title: "Deep AI Report Ready",
        message: `Your Deep AI Verification Report for ${name} is ready to view.`,
      }),
    });

    return NextResponse.json({
      success: true,
      reportId: reportRef.id,
      aiSummary: summaryText,
      merged,
    });
  } catch (err: any) {
    console.error("Error in analyze-deep:", err);
    return NextResponse.json({ error: "Failed to process deep analysis" }, { status: 500 });
  }
}
