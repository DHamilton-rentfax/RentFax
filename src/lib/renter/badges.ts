export function getRenterBadges(history: any[]) {
  const badges = [];

  if (history.every((h) => h.returnedOnTime)) {
    badges.push("On-Time Renter");
  }

  if (history.filter((h) => h.incident).length === 0) {
    badges.push("Perfect Record");
  }

  if (history.length >= 5) {
    badges.push("Trusted Renter");
  }

  return badges;
}
