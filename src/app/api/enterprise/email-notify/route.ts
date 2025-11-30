import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email"; // your existing email util

export async function POST(req: Request) {
  const data = await req.json();

  const adminEmail = "info@rentfax.io";

  // Email to Admin
  await sendEmail({
    to: adminEmail,
    subject: `New Enterprise Application: ${data.companyName}`,
    html: `
      <h2>New Enterprise Lead</h2>
      <p><strong>Company:</strong> ${data.companyName}</p>
      <p><strong>Contact:</strong> ${data.fullName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Industry:</strong> ${data.industry}</p>
      <p><strong>Locations:</strong> ${data.locations}</p>
      <p><strong>EIN:</strong> ${data.ein}</p>
      <p><strong>DUNS:</strong> ${data.duns}</p>
    `,
  });

  // Email to Applicant
  await sendEmail({
    to: data.email,
    subject: "Enterprise Application Received — RentFAX",
    html: `
      <h2>Thank You</h2>
      <p>Your enterprise application has been received.</p>
      <p>Our team will contact you within 24 hours.</p>
    `,
  });

  return NextResponse.json({ success: true });
}
