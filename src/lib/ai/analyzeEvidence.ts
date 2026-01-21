import { openai } from "@/lib/ai/openai";

export async function analyzeEvidence({
  incidentId,
  storagePath,
  downloadURL,
}: {
  incidentId: string;
  storagePath: string;
  downloadURL: string;
}) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Extract structured incident data from rental evidence.",
      },
      {
        role: "user",
        content: `
Evidence URL: ${downloadURL}

Return JSON:
{
  incidentDate,
  amount,
  description,
  parties
}
`,
      },
    ],
  });

  const extracted = JSON.parse(response.choices[0].message.content || "{}");

  return { extracted };
}
