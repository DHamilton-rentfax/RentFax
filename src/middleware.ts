import { NextRequest, NextResponse } from "next/server";

const RATE_LIMIT = 100; // requests per 15 min
const WINDOW = 15 * 60 * 1000;
const buckets = new Map<string, { count: number; reset: number }>();

export function middleware(req: NextRequest) {
  const ip = req.ip ?? "unknown";
  const now = Date.now();
  const bucket = buckets.get(ip) ?? { count: 0, reset: now + WINDOW };

  if (now > bucket.reset) {
    bucket.count = 0;
    bucket.reset = now + WINDOW;
  }

  bucket.count++;
  buckets.set(ip, bucket);

  if (bucket.count > RATE_LIMIT) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"], // apply to all API routes
};
