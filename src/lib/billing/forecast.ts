// Simple projection: based on current month usage and daily trend
export function forecastUsage(used: number, limit: number, daysUsed: number) {
  if (daysUsed === 0) return { dailyAvg: 0, projected: 0, willExceed: false };

  const dailyAvg = used / daysUsed;
  const projected = dailyAvg * 30;
  const willExceed = projected > limit && limit !== Infinity;

  const percentUsed = limit === Infinity ? 0 : Math.round((used / limit) * 100);
  const percentProjected =
    limit === Infinity ? 0 : Math.round((projected / limit) * 100);

  return {
    dailyAvg,
    projected,
    willExceed,
    percentUsed,
    percentProjected,
  };
}
