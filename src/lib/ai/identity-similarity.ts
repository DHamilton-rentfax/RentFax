export function computeIdentitySimilarity(input: any, profile: any) {
  let score = 0;

  if (!profile) return 0;

  if (profile.fullName && input.fullName) {
    const p = profile.fullName.toLowerCase();
    const i = input.fullName.toLowerCase();
    if (p === i) score += 30;
    else if (p.includes(i) || i.includes(p)) score += 20;
  }

  if (profile.email && input.email && profile.email === input.email) {
    score += 20;
  }

  if (profile.phone && input.phone && profile.phone === input.phone) {
    score += 20;
  }

  if (profile.licenseNumber && input.licenseNumber) {
    if (profile.licenseNumber === input.licenseNumber) {
      score += 30;
    }
  }

  return Math.min(score, 100);
}
