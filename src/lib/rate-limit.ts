const bucket = new Map<string, { count: number; ts: number }>();

export function rateLimit(ip: string, limit = 20, windowMs = 10000) {
  const now = Date.now();
  const entry = bucket.get(ip) || { count: 0, ts: now };

  if (now - entry.ts < windowMs) {
    entry.count++;
    if (entry.count > limit) {
      return false;
    }
  } else {
    entry.count = 1;
    entry.ts = now;
  }

  bucket.set(ip, entry);
  return true;
}
