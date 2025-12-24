import { NextRequest, NextResponse } from "next/server";
import { getRecommendedHelp } from "@/lib/support/recommend";
import { getUserRoleFromHeaders } from "@/lib/auth/roles";

export async function POST(req: NextRequest) {
  const { context } = await req.json();

  if (!context) {
    return NextResponse.json({ error: "Context is required" }, { status: 400 });
  }

  const role = getUserRoleFromHeaders(req.headers) || "UNKNOWN";

  try {
    const results = await getRecommendedHelp({ context, role });
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching recommended help:", error);
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 });
  }
}
