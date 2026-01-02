import { db } from "@/firebase/server";
import { embedText } from "./embed";

function cosine(a: number[], b: number[]) {
  const dot = a.reduce((s, v, i) => s + v * b[i], 0);
  const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
  return dot / (magA * magB);
}

export async function retrieveKnowledge(query: string) {
  const queryEmbedding = await embedText(query);
  const vectors = await db.collection("knowledge_vectors").get();

  const ranked = vectors.docs
    .map((doc) => ({
      id: doc.id,
      score: cosine(queryEmbedding, doc.data().embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const docs = await Promise.all(
    ranked.map((r) => db.collection("knowledge_base").doc(r.id).get())
  );

  return docs.map((d) => d.data()?.content).filter(Boolean);
}
