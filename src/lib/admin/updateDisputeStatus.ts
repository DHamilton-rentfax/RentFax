import { doc, getDoc, updateDoc } from "firebase/firestore";

import { db } from "@/firebase/client";
import { sendEmail } from "@/lib/notifications/sendEmail";

export async function updateDisputeStatus(id: string, newStatus: string) {
  const ref = doc(db, "disputes", id);
  await updateDoc(ref, { status: newStatus });

  // Notify renter
  const disputeDoc = await getDoc(ref);
  const disputeData = disputeDoc.data();

  if (disputeData && disputeData.email) {
    await sendEmail({
      to: disputeData.email,
      subject: `Your dispute status has been updated`,
      html: `<p>Your dispute regarding incident #${id} is now marked as <b>${newStatus}</b>.</p>`,
    });
  }
}
