import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateDisputeSummary({
  renterStatement,
  adminNotes,
  resolution,
}: {
  renterStatement: string;
  adminNotes?: string;
  resolution?: string;
}) {
  try {
    const prompt = `
    Summarize the following dispute in a neutral, factual tone.
    Include: renter's statement, admin perspective, and final outcome.

    Renter's Statement: ${renterStatement}
    Admin Notes: ${adminNotes || "N/A"}
    Resolution: ${resolution || "Pending"}
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: prompt }],
      temperature: 0.3,
    });

    return completion.choices[0].message.content?.trim() || "Summary not available.";
  } catch (err) {
    console.error("AI summary error:", err);
    return "Summary unavailable due to AI processing error.";
  }
}
