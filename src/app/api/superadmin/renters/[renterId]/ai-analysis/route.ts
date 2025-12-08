import { NextResponse } from "next/server";
import { analyzeRenterBehavior } from "@/lib/ai/analyzeRenterBehavior";

export async function GET(
  req: Request,
  { params }: { params: { renterId: string } }
) {
  try {
    const result = await analyzeRenterBehavior(params.renterId);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: "AI analysis failed", details: (err as any).message },
      { status: 500 }
    );
  }
}
