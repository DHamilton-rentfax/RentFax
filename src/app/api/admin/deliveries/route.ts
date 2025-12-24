import { NextResponse } from "next/server";

// Dummy API endpoint for delivery monitor UI
export async function GET() {
    return NextResponse.json({ deliveries: [] });
}