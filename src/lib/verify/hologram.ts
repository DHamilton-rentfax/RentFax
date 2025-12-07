import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function detectHologram(image: string) {
  const prompt = `
  Detect if this identity document has a hologram or reflective security feature.
  Return JSON { hologramPresent: boolean, confidence: number }
  `;

  const resp = await client.responses.parse({
    model: "gpt-4.1",
    input: [
      { role: "system", content: prompt },
      { role: "user", image_url: image },
    ],
  });

  return resp;
}
