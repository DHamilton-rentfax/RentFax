import { NextResponse } from "next/server";

export async function GET() {
  // Dummy data for now. In a real app, this would check a database.
  const subscription = {
    plan: "free", // "free" or "premium"
    isPaying: false,
  };

  return NextResponse.json(subscription);
}
