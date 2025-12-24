import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSupportAISuggestion(text: string) {
  if (!text) return null;

  const prompt = `
You are the RentFAX Support AI.
Analyze the user'''s message and return:

1. Suggested reply (professional, simple, actionable)
2. Primary intent
3. Secondary tags (comma-separated keywords)
4. Should this message be turned into a FAQ? ("yes" or "no")

User message:
"${text}"

Respond ONLY in JSON:
{
  "reply": "",
  "intent": "",
  "tags": "",
  "faqCandidate": ""
}
`;

  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return JSON.parse(res.choices[0].message.content);
}
