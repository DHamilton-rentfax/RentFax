import OpenAI from "openai";

import { adminDb as db, adminFirestore as FieldValue } from "@/firebase/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function triggerReputationCommentary({
  renterId,
  newScore,
  previousScore,
  scoreChange,
}: {
  renterId: string;
  newScore: number;
  previousScore: number;
  scoreChange: number;
}) {
  try {
    const direction =
      scoreChange > 0 ? "improved" : scoreChange < 0 ? "declined" : "remained stable";
    const absChange = Math.abs(scoreChange);

    const prompt = `
You are RentFAX's AI compliance analyst.
Summarize the renter's reputation change concisely (1–2 sentences).
Mention whether it improved or declined, why it might have changed, and provide overall context.

Details:
- Previous Score: ${previousScore}
- New Score: ${newScore}
- Change: ${scoreChange} (${direction})
- Absolute Change: ${absChange}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
    });

    const commentary = response.choices[0].message.content?.trim() ?? "No commentary generated.";

    await db.collection("renterAIComments").add({
      renterId,
      previousScore,
      newScore,
      scoreChange,
      direction,
      commentary,
      createdAt: FieldValue.serverTimestamp(),
    });

    return commentary;

  } catch (error) {
    console.error("Error triggering reputation commentary:", error);
    return null;
  }
}
