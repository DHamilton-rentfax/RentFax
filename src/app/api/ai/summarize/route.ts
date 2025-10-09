import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || text.length < 30) {
      return NextResponse.json({ summary: "Not enough text to summarize." });
    }

    // Use your AI model (Gemini or OpenAI)
    const prompt = `
    Summarize this renter dispute clearly and neutrally for an admin record:
    ---
    ${text}
    `;

    // Replace this with your AI client
    const summary = `AI Summary: ${text.slice(0, 180)}... (sample summary)`; 

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("AI summary error:", error);
    return NextResponse.json({ error: "Failed to summarize" }, { status: 500 });
  }
}
