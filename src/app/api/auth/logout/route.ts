
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const res = NextResponse.json({ success: true });

  // Clear cookies
  res.cookies.delete('session');
  res.cookies.delete('uid');
  res.cookies.delete('plan');

  return res;
}
