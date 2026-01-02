import { adminDb } from "@/firebase/server";

const KNOWLEDGE = [
  {
    title: "What is RentFAX",
    category: "Platform",
    visibility: "public",
    content: "RentFAX is a renter verification and trust platform.",
  },
];

async function ingest() {
  for (const doc of KNOWLEDGE) {
    await adminDb.collection("knowledge_base").add({
      ...doc,
      status: "approved",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }
  console.log("✅ Knowledge ingested");
}

ingest();
