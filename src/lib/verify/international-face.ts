import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function matchInternationalFace(selfie: string, documentFace: string) {
  const prompt = `
  Compare these two faces across ethnicities, lighting conditions, and resolution.

  Return JSON:
  {
    "similarity": 0-1,
    "verdict": "MATCH" | "NO_MATCH" | "INCONCLUSIVE"
  }
  `;

  const resp = await client.responses.parse({
    model: "gpt-4.1",
    input: [
      { role: "system", content: prompt },
      { role: "user", image_url: selfie },
      { role: "user", image_url: documentFace },
    ],
  });

  return resp;
}
