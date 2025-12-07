import { NextResponse } from "next/server";
import { adminStorage } from "@/firebase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");

  if (!path) {
    return NextResponse.json({ error: "Missing file path" }, { status: 400 });
  }

  const bucket = adminStorage.bucket();
  const file = bucket.file(path);

  try {
    const [buffer] = await file.download();
    return new NextResponse(buffer, {
      headers: { "Content-Type": "image/jpeg" },
    });
  } catch (err) {
    console.error("File fetch error:", err);
    return NextResponse.json(
      { error: "File not found" },
      { status: 404 }
    );
  }
}
