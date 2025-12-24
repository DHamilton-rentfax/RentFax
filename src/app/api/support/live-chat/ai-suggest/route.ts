import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { generateSupportAISuggestion } from "@/lib/ai/support-ai";

export async function POST(req: Request) {
  const { conversationId, messageId, text } = await req.json();

  if (!conversationId || !messageId || !text) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Generate AI reply suggestion
  const suggestion = await generateSupportAISuggestion(text);

  if (!suggestion) {
    return NextResponse.json({ error: "AI returned null" }, { status: 400 });
  }

  const { reply, intent, tags, faqCandidate } = suggestion;

  // Write AI suggestion to Firestore
  await adminDb
    .collection("liveChatMessages")
    .doc(messageId)
    .update({
      aiSuggestedReply: reply,
      aiIntent: intent,
      aiTags: tags,
      faqCandidate: faqCandidate === "yes",
    });

  return NextResponse.json({ success: true, suggestion });
}
