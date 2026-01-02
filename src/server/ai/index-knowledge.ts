import { db } from "@/firebase/server";
import { embedText } from "./embed";

export async function indexKnowledge(docId: string, content: string) {
  const embedding = await embedText(content);

  await db.collection("knowledge_vectors").doc(docId).set({
    embedding,
    updatedAt: Date.now(),
  });
}
