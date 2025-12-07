import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function generateRenterInsights(profile: any, incidents: any[]) {
  const prompt = `
    Analyze this renter's behavior and provide:
    - Positive insights
    - Recommendations for improvement
    - Risk warnings
    - Identity consistency rating
    Data:
    Profile: ${JSON.stringify(profile)}
    Incidents: ${JSON.stringify(incidents)}
  `;

  const resp = await client.responses.create({
    model: "gpt-4.1",
    input: prompt,
  });

  return resp.output_text;
}
