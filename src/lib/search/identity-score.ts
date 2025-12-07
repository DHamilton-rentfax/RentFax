export function computeIdentityScore({ enriched, email, phone }: any) {
  let score = 0;

  if (email) score += 25;
  if (phone) score += 25;
  if (enriched?.emailValid) score += 10;
  if (enriched?.phoneValid) score += 10;

  if (enriched?.city) score += 10;
  if (enriched?.ageRange) score += 20;

  return Math.min(100, score);
}