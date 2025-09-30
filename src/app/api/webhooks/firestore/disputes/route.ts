
import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/server";
import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY!);

async function sendNotification(userId: string, title: string, body: string, link: string) {
  await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid: userId, type: 'dispute', title, body, link }),
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { orgId, renterId, type, id, message } = body;

  const orgDoc = await adminDB.doc(`orgs/${orgId}`).get();
  const renterDoc = await adminDB.doc(`orgs/${orgId}/renters/${renterId}`).get();

  const orgData = orgDoc.data();
  const renterData = renterDoc.data();
  const orgEmail = orgData?.email;
  const renterEmail = renterData?.email;
  const orgAdminUserId = orgData?.adminUserId; 
  const renterUserId = renterData?.userId;

  if (type === "dispute_created") {
    if (orgAdminUserId) {
        const userDoc = await adminDB.doc(`users/${orgAdminUserId}`).get();
        const prefs = userDoc.get("notificationPrefs");

        if (prefs?.disputes?.email && !prefs?.digest?.enabled) {
            await sendgrid.send({
                to: orgEmail,
                from: "noreply@rentfax.ai",
                subject: "🚨 New Dispute Filed",
                html: `<p>A new dispute has been filed by ${renterData?.name}.</p>
                        <p><a href='''${process.env.NEXT_PUBLIC_APP_URL}/dashboard/disputes/${id}'''>View Dispute</a></p>`
            });
        }
        if (prefs?.disputes?.inApp) {
            await sendNotification(orgAdminUserId, "New Dispute Filed", `A new dispute has been filed by ${renterData?.name}.`, `/dashboard/disputes/${id}`);
        }
    }
  }

  if (type === "message_sent") {
    if (message.from === 'landlord') {
        if(renterUserId) {
            const userDoc = await adminDB.doc(`users/${renterUserId}`).get();
            const prefs = userDoc.get("notificationPrefs");

            if (prefs?.messages?.email && !prefs?.digest?.enabled) {
                 await sendgrid.send({
                    to: renterEmail,
                    from: "noreply@rentfax.ai",
                    subject: "💬 New Message in Dispute",
                    html: `<p>You have a new message from your landlord.</p><blockquote>${message.text}</blockquote>
                            <p><a href='''${process.env.NEXT_PUBLIC_APP_URL}/renter/disputes/${id}'''>Open Dispute</a></p>`
                });
            }

            if (prefs?.messages?.inApp) {
                await sendNotification(renterUserId, "New Message", "You have a new message from your landlord.", `/renter/disputes/${id}`);
            }
        }
    } else {
        if(orgAdminUserId) {
            const userDoc = await adminDB.doc(`users/${orgAdminUserId}`).get();
            const prefs = userDoc.get("notificationPrefs");

            if (prefs?.messages?.email && !prefs?.digest?.enabled) {
                 await sendgrid.send({
                    to: orgEmail,
                    from: "noreply@rentfax.ai",
                    subject: "💬 New Message in Dispute",
                    html: `<p>${renterData?.name} wrote:</p><blockquote>${message.text}</blockquote>
                            <p><a href='''${process.env.NEXT_PUBLIC_APP_URL}/dashboard/disputes/${id}'''>Open Dispute</a></p>`
                });
            }
            if (prefs?.messages?.inApp) {
                await sendNotification(orgAdminUserId, "New Message", `You have a new message from ${renterData?.name}.`, `/dashboard/disputes/${id}`);
            }
        }
    }
  }

  return NextResponse.json({ ok: true });
}
