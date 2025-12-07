import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function generateBehaviorPattern(graph: any) {
  const prompt = `
    Analyze the following renter behavior graph and describe:
    - overall behavior pattern
    - strengths
    - warnings
    - consistency
    - behavioral trend direction
    - potential future risk indicators

    DATA:
    ${JSON.stringify(graph)}
  `;

  // This is a mock implementation.
  // In a real scenario, you would call an AI model.
  return Promise.resolve("STABLE");
}
