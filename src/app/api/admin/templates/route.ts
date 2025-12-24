import { NextResponse } from "next/server";

// Dummy API endpoint for template manager UI
export async function GET() {
    return NextResponse.json({ templates: [] });
}