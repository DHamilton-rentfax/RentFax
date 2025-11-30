         import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { incident, fraudSignals, timeline } = await req.json();

  const prompt = `
    You are RentFAX Incident AI.
    Generate a short admin-facing summary:
    - Key facts
    - Dispute risk
    - Credibility
    - Fraud likelihood
    Incident: ${JSON.stringify(incident)}
    Fraud: ${JSON.stringify(fraudSignals)}
    Timeline: ${JSON.stringify(timeline)}
  `;

  const result = await client.responses.create({
    model: "gpt-5.1",
    input: prompt
  });

  return NextResponse.json({ summary: result.output_text });
}
