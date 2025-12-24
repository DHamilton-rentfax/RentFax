import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { adminDb } from "@/firebase/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { query } = await req.json();

  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: query,
  });

  const queryVector = embedding.data[0].embedding;

  // get articles
  const snapshot = await adminDb.collection("help_articles").get();
  const articles = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // compute similarity (cosine)
  function cosineSimilarity(a: number[], b: number[]) {
    const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
    const magB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
    return dot / (magA * magB);
  }

  const ranked = articles
    .map((a) => ({
      ...a,
      score: cosineSimilarity(queryVector, a.embeddingVector),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return NextResponse.json({ results: ranked });
}
