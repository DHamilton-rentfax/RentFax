export function reportHasUpdate(report: {
  lastUpdatedAt?: any;
  lastUnlockedAt?: any;
}) {
  if (!report.lastUpdatedAt) return false;
  if (!report.lastUnlockedAt) return true;

  return (
    report.lastUpdatedAt.toMillis() >
    report.lastUnlockedAt.toMillis()
  );
}
