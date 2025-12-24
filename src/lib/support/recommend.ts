import { adminDb } from "@/firebase/server";

interface HelpParams {
    context: string;
    role: string;
}

/**
 * Fetches recommended help articles and backlog items based on user context and role.
 * 
 * @param {HelpParams} params - The context and role of the user.
 * @returns {Promise<object>} A promise that resolves to an object containing FAQs and backlog items.
 */
export async function getRecommendedHelp({ context, role }: HelpParams) {
  // 1. Fetch top FAQ for this context, filtered by audience
  const faqSnap = await adminDb
    .collection("help_articles")
    .where("contextTags", "array-contains", context)
    .where("audience", "in", ["all", role])
    .orderBy("views", "desc")
    .limit(3)
    .get();

  const faqs = faqSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  // 2. Look at backlog items relevant to this context
  const backlogSnap = await adminDb
    .collection("support_content_backlog")
    .where("contextExamples", "array-contains", context)
    .orderBy("totalCount", "desc")
    .limit(3)
    .get();

  const backlog = backlogSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  // 3. Return combined results
  return {
    faqs,
    backlog,
  };
}
