import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function analyzeDocumentAuthenticity(image: string) {
  const prompt = `
    Analyze this identity document for authenticity.
    Check for:
    - text tampering
    - unnatural font differences
    - mismatched edges
    - pixel manipulation
    - hologram presence
    - watermark distortion
    - replaced photo
    - fake shadows
    - incorrect document layout

    Respond in JSON:
    {
      "authenticityScore": 0-100,
      "flags": [],
      "verdict": "LIKELY_REAL" | "SUSPICIOUS" | "LIKELY_FAKE"
    }
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
