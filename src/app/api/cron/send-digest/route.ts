import { NextResponse } from "next/server";
import { adminDB } from "@/firebase/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function GET() {
  const orgs = await adminDB.collection("orgs").get();

  for (const org of orgs.docs) {
    const orgId = org.id;
    const rentersSnap = await adminDB.collection(`orgs/${orgId}/renters`).get();
    const disputesSnap = await adminDB.collection(`orgs/${orgId}/disputes`).get();

    const activeRenters = rentersSnap.size;
    const openDisputes = disputesSnap.docs.filter(d => d.get("status") === "OPEN").length;

    const msg = {
      to: org.get("ownerEmail"),
      from: "noreply@rentfax.ai",
      subject: "Weekly RentFAX Digest",
      text: `Org: ${orgId}\nRenters: ${activeRenters}\nOpen Disputes: ${openDisputes}`,
    };

    await sgMail.send(msg);
  }

  return NextResponse.json({ ok: true });
}
