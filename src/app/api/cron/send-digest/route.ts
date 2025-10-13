import { NextResponse } from "next/server";
import { dbAdmin } from "@/lib/firebase-admin";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function GET() {
  const orgs = await dbAdmin.collection("orgs").get();

  for (const org of orgs.docs) {
    const orgId = org.id;
    const rentersSnap = await dbAdmin.collection(`orgs/${orgId}/renters`).get();
    const disputesSnap = await dbAdmin
      .collection(`orgs/${orgId}/disputes`)
      .get();

    const activeRenters = rentersSnap.size;
    const openDisputes = disputesSnap.docs.filter(
      (d) => d.get("status") === "OPEN",
    ).length;

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
