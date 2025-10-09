// This is a placeholder for the summarize route
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  return NextResponse.json({ message: 'Summarize endpoint' });
}
