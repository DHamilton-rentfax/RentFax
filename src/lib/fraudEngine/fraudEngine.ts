// src/lib/fraudEngine/fraudEngine.ts
import { identityResolver } from "./identityResolver";
import { riskEngine } from "./riskEngine";
import { syncIncident } from "./syncIncident";

export async function runFraudEngine(userId: string, renterData: any) {
  // 1. Resolve identity
  const identity = await identityResolver(renterData);

  // 2. Compute risk
  const risk = await riskEngine({
    userId,
    identity,
    renterData,
  });

  // 3. Sync incident if high risk
  if (risk.score >= 80) {
    await syncIncident({
      renterId: renterData.id,
      risk,
      identity,
    });
  }

  return {
    identity,
    risk,
  };
}
