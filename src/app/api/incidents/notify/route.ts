import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { dbAdmin as db } from "@/firebase/client-admin";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return new NextResponse("Missing id", { status: 400 });
    }

    const incidentDoc = await db.collection("incidents").doc(id).get();
    if (!incidentDoc.exists) {
      return new NextResponse("Incident not found", { status: 404 });
    }

    const incident = incidentDoc.data();
    if (!incident) {
      return new NextResponse("Incident not found", { status: 404 });
    }

    const renterDoc = await db
      .collection("renters")
      .doc(incident.renterId)
      .get();
    if (!renterDoc.exists) {
      return new NextResponse("Renter not found", { status: 404 });
    }

    const renter = renterDoc.data();
    if (!renter) {
      return new NextResponse("Renter not found", { status: 404 });
    }

    const incidentUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/incidents/${id}`;

    await sendEmail({
      to: renter.email,
      subject: "A new incident has been reported",
      html: `
        <h1>New Incident Reported</h1>
        <p>A new incident has been reported against you. You can view the details and dispute the incident by clicking the link below:</p>
        <a href="${incidentUrl}">View Incident</a>
      `,
    });

    return new NextResponse("Email sent successfully", { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
