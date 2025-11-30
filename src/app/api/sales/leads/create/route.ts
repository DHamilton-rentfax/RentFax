
import { NextResponse } from "next/server";
import { createLead } from "@/actions/sales/leads";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await createLead(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
