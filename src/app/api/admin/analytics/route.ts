// This is a placeholder for the admin analytics route
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  return NextResponse.json({ message: "Admin analytics endpoint" });
}
