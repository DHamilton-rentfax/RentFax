import { paymentScore } from "./payments";
import { incidentImpact } from "./incidents";
import { identityIntegrityScore } from "./identity";
import { analyzeBehaviorTrends } from "./ai-trends";

export async function computeRentfaxScore(renter: any, history: any) {
  const payment = paymentScore(history.payments);
  const incidentPenalty = incidentImpact(history.incidents);
  const identity = identityIntegrityScore(renter.identity);
  const trends = await analyzeBehaviorTrends(history.events);

  let score = payment + incidentPenalty + identity + trends;

  return Math.min(900, Math.max(300, score));
}
