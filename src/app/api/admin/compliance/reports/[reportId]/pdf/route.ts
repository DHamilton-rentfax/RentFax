import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse("PDF generation coming soon", {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}
