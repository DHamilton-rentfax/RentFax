// src/types/knowledge.ts
export type KnowledgeDoc = {
  id: string;
  title: string;
  content: string; // markdown or plain text
  category:
    | "Platform"
    | "Verification"
    | "Billing"
    | "Disputes"
    | "Fraud"
    | "Privacy"
    | "Legal"
    | "InternalDecision";
  visibility: "public" | "internal"; // AI can read both
  createdAt: number;
  updatedAt: number;
};
