import { NextResponse } from "next/server";
import { retrieveKnowledge } from "@/server/ai/retrieve";
import { saveFAQCandidate } from "@/server/faq/save";

export async function POST(req: Request) {
  const { question, context } = await req.json();

  const knowledge = await retrieveKnowledge(question);

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content:
            "You are RentFAX AI. Answer only using provided RentFAX knowledge.",
        },
        {
          role: "user",
          content: `
Context:
${JSON.stringify(context)}

Knowledge:
${knowledge.join("\n\n")}

Question:
${question}
`,
        },
      ],
    }),
  });

  const json = await res.json();
  const answer = json.choices?.[0]?.message?.content ?? "I don’t know.";

  await saveFAQCandidate(question, answer);

  return NextResponse.json({ answer });
}
