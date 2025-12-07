export function computeIdentityConfidence(profile: any) {
  let score = 0;

  if (profile.dlHash) score += 40;
  if (profile.phone) score += 10;
  if (profile.email) score += 10;

  if (profile.deviceIds?.length >= 1) score += 15;

  if (profile.faceMatchScore && profile.faceMatchScore > 0.75)
    score += 15;

  if (profile.address) score += 5;
  if (profile.addressHistory?.length > 2) score += 5;

  return Math.min(score, 100);
}
