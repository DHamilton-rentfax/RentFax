import { db } from "@/firebase/server";

export async function saveFAQCandidate(question: string, answer: string) {
  const ref = db.collection("faqs");

  const existing = await ref.where("question", "==", question).limit(1).get();

  if (!existing.empty) {
    const doc = existing.docs[0];
    await doc.ref.update({
      askedCount: (doc.data().askedCount || 0) + 1,
      lastAskedAt: Date.now(),
    });
    return;
  }

  await ref.add({
    question,
    answer,
    source: "ai-chat",
    status: "pending",
    askedCount: 1,
    createdAt: Date.now(),
  });
}
