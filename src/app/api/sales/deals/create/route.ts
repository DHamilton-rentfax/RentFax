
import { NextResponse } from "next/server";
import { createDeal } from "@/actions/sales/deals";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await createDeal(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
