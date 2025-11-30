
import { PiplProvider } from "./providers/PiplProvider";
import { normalizePublicData } from "./normalizePublicData";
import { computeMatchScore } from "./matchScore";

export async function getPublicData(input: any) {
  const provider = new PiplProvider();

  const raw = await provider.search(input);
  const normalized = normalizePublicData(raw);

  normalized.matchScore = computeMatchScore(input, normalized);

  return normalized;
}
