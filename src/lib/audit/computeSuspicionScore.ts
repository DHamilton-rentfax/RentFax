export function computeSuspicionScore(log) {
  let score = 0;

  // Too many searches in a short window
  if (log.searchCountLastHour > 20) score += 30;

  // Off-hours activity
  const hour = new Date(log.timestamp).getHours();
  if (hour < 6 || hour > 22) score += 20;

  // Device mismatch
  if (log.deviceMismatch) score += 15;

  // IP mismatch (traveling or VPN)
  if (log.ipMismatch) score += 15;

  // Searching outside assigned company scope
  if (log.crossCompanySearch) score += 10;

  // Repeated lookup of same renter
  if (log.repeatSearches > 5) score += 10;

  return Math.min(score, 100);
}
