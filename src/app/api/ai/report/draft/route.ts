import { FieldValue } from "firebase-admin/firestore";

import { NextResponse } from "next/server";
import OpenAI from "openai";
import { adminDb } from "@/firebase/server";


const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { renter, incidents, disputes } = await req.json();

  const prompt = `
    You are RentFAX AI. Generate clear, objective narratives 
    for rental history reports.

    Renter: ${JSON.stringify(renter)}
    Incidents: ${JSON.stringify(incidents)}
    Disputes: ${JSON.stringify(disputes)}

    Output a JSON object:
    {
      "incidentNarratives": {...},
      "disputeNarratives": {...},
      "historySummary": "",
      "fraudSummary": "",
      "behaviorSummary": "",
      "riskExplanation": "",
      "legalText": ""
    }
  `;

  const result = await client.responses.create({
    model: "gpt-5.1",
    input: prompt
  });

  const text = JSON.parse(result.output_text);

  await updateDoc(doc(db, "narratives", renter.id), {
    ...text,
    updatedAt: new Date()
  });

  return NextResponse.json({ success: true });
}
