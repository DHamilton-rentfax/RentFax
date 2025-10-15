import { NextRequest, NextResponse } from "next/server";
import { dbAdmin as db } from "@/firebase/client-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  try {
    const { renterId, description, amount, fileUrls } = await req.json();

    if (!renterId || !description || amount === undefined) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const newIncident = {
      renterId,
      description,
      amount,
      evidence: fileUrls || [],
      status: "open",
      createdAt: FieldValue.serverTimestamp(),
    };

    const incidentRef = await db.collection("incidents").add(newIncident);

    // Asynchronously call the notify endpoint without awaiting the response
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/incidents/notify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: incidentRef.id }),
    });

    return new NextResponse(JSON.stringify({ id: incidentRef.id }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating incident:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
