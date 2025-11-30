
export function scorePublicRecords(publicRecords) {
  if (!publicRecords) return 0;

  let score = 0;

  // No DOB = weaker match
  if (!publicRecords.dob) score += 5;

  // More emails/phones = stronger identity footprint
  score += Math.min(publicRecords.emails?.length * 3, 12);
  score += Math.min(publicRecords.phones?.length * 3, 12);

  // Address footprint
  score += Math.min(publicRecords.addresses?.length * 2, 8);

  return Math.min(30, score);
}
