import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { disputes } = await req.json();

  const prompt = `
     Convert the following disputes into objective summaries:
     ${JSON.stringify(disputes)}
  `;

  const response = await client.responses.create({
    model: "gpt-5.1",
    input: prompt
  });

  return NextResponse.json({ text: response.output_text });
}
