import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json(
      { error: "Missing address" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );

    const data = await res.json();

    if (data.status !== "OK" || !data.results?.length) {
      return NextResponse.json(
        { valid: false, error: data.error_message || "Invalid address" },
        { status: 400 }
      );
    }

    const result = data.results[0];
    const { lat, lng } = result.geometry.location;

    return NextResponse.json({
      valid: true,
      formatted: result.formatted_address,
      lat,
      lng,
      types: result.types,
    });
  } catch (err) {
    console.error("Address verify error:", err);
    return NextResponse.json(
      { error: "Address lookup failed" },
      { status: 500 }
    );
  }
}
