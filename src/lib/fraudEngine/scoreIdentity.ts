// src/lib/fraudEngine/scoreIdentity.ts

export function scoreIdentity(result: {
  nameMatch: boolean;
  dobMatch: boolean;
  selfieMatch: boolean;
}) {
  let score = 0;

  if (result.nameMatch) score += 40;
  if (result.dobMatch) score += 40;
  if (result.selfieMatch) score += 20;

  return score; // out of 100
}
