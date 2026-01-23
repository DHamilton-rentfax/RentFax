import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { sendEmail } from "@/lib/email"; // Assuming a simple email utility

export async function POST(req: NextRequest) {
  try {
    const { email, role, inviterName, companyName } = await req.json();

    if (!email || !role || !inviterName || !companyName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Generate a unique token for the invite
    const token = Buffer.from(`${email}-${Date.now()}`).toString("base64url");

    // Save invite to Firestore
    const inviteRef = await addDoc(collection(adminDb, "invites"), {
      email,
      role,
      status: "PENDING",
      createdAt: serverTimestamp(),
      inviterName,
      companyName,
      token,
    });

    // Construct the invitation link
    const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/invite/${token}`;

    // Send the invitation email
    await sendEmail({
      to: email,
      subject: `You have been invited to join ${companyName} on RentFAX`,
      html: `
        <p>You have been invited to join ${companyName} as a ${role}.</p>
        <p>Click the link below to accept your invitation:</p>
        <a href="${inviteLink}">${inviteLink}</a>
        <p>If you were not expecting this invitation, you can safely ignore it.</p>
      `,
    });

    return NextResponse.json({ success: true, inviteId: inviteRef.id });
  } catch (error) {
    console.error("Error sending invite:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
