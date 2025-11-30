import { NextResponse } from "next/server";
import { adminDB } from "@/firebase/server";
import { lowCreditsTemplate } from "@/lib/email/templates/lowCredits";
import { sendEmail } from "@/lib/email/send";

export async function GET() {
  const creditsSnap = await adminDB.collection("credits").get();

  for (const doc of creditsSnap.docs) {
    const userId = doc.id;
    const credits = doc.data()?.count ?? 0;

    if (credits < 5) {
      const user = await adminDB.collection("users").doc(userId).get();

      if (!user.exists) continue;

      await sendEmail({
        to: user.data().email,
        ...lowCreditsTemplate({ credits }),
      });
    }
  }

  return NextResponse.json({ success: true });
}
