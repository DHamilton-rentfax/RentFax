import { adminDb } from "@/firebase/server";

type SourceType = "CHAT" | "SEARCH" | "NOTE";

export async function upsertBacklogFromSignal({
  sourceType,
  query,
  context,
  role,
}: {
  sourceType: SourceType;
  query: string;
  context: string;
  role: string;
}) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return;

  // Simple approach: group by first 80 chars
  const key = normalized.slice(0, 80);

  const snap = await adminDb
    .collection("support_content_backlog")
    .where("sampleQuestionKey", "==", key)
    .limit(1)
    .get();

  const now = new Date();

  if (snap.empty) {
    const roleCounts: Record<string, number> = {};
    roleCounts[role] = 1;

    await adminDb.collection("support_content_backlog").add({
      title: normalized.length > 60 ? normalized.slice(0, 60) + "..." : normalized,
      sampleQuestion: query,
      sampleQuestionKey: key,
      sourceType,
      queries: [query],
      contextExamples: [context],
      roleCounts,
      totalCount: 1,
      status: "new",
      createdAt: now,
      updatedAt: now,
      lastSeenAt: now,
    });
  } else {
    const doc = snap.docs[0];
    const data: any = doc.data();

    const roleCounts = data.roleCounts || {};
    roleCounts[role] = (roleCounts[role] || 0) + 1;

    const queries = data.queries || [];
    if (!queries.includes(query)) queries.push(query);

    const contextExamples = data.contextExamples || [];
    if (!contextExamples.includes(context)) contextExamples.push(context);

    await doc.ref.update({
      roleCounts,
      totalCount: (data.totalCount || 0) + 1,
      queries,
      contextExamples,
      sourceType, // last source
      updatedAt: now,
      lastSeenAt: now,
    });
  }
}