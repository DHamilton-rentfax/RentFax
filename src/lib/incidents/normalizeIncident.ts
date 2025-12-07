
import { serverTimestamp } from "@/firebase/server";

export function normalizeIncident(payload: any) {
  return {
    id: payload.id,
    renterId: payload.renterId,
    companyId: payload.companyId,
    createdBy: payload.createdBy,
    category: payload.category,
    details: payload.details,
    evidence: payload.evidence,
    cost: payload.cost,
    metadata: payload.metadata,
    summary: generateSummary(payload),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

function generateSummary(payload: any) {
  const cat = payload.category.replace(/-/g, " ").toUpperCase();
  if (payload.cost) return `${cat} — Cost $${payload.cost}`;
  return `${cat} incident reported`;
}
