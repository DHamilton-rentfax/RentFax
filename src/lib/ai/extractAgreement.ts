import '@/lib/server-only';
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function extractAgreement(text: string) {
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Extract structured rental payment data. No opinions. Only facts."
      },
      {
        role: "user",
        content: text
      }
    ],
    temperature: 0
  });

  return JSON.parse(res.choices[0].message.content!);
}