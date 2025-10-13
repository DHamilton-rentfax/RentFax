import { NextResponse } from "next/server";

export async function POST() {
  try {
    const baseUrl = "https://rentfax.io/sitemap.xml";

    // Notify search engines of new sitemap updates
    await Promise.all([
      fetch(`https://www.google.com/ping?sitemap=${baseUrl}`),
      fetch(`https://www.bing.com/ping?sitemap=${baseUrl}`),
    ]);

    console.log("✅ Sitemap pinged successfully");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error pinging sitemap:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
