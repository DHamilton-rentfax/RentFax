"use server";

import { randomBytes } from "crypto";

import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

import { adminDB } from "@/firebase/server";
import { sendEmail } from "@/lib/notifications/sendEmail";
import { sendSMS } from "@/lib/notifications/sendSMS";

export async function createVerificationToken({
  name,
  email,
  phone,
}: {
  name: string;
  email: string;
  phone?: string;
}) {
  const token = randomBytes(24).toString("hex");
  const expiresAt = Timestamp.fromMillis(Date.now() + 24 * 60 * 60 * 1000); // 24 h

  await addDoc(collection(adminDB, "verificationTokens"), {
    token,
    renterEmail: email,
    renterName: name,
    expiresAt,
    used: false,
    createdAt: serverTimestamp(),
  });

  const verifyUrl = `${process.env.NEXT_PUBLIC_URL}/renter/verify?token=${token}`;

  await sendEmail({
    to: email,
    subject: "Verify your RentFAX account",
    html: `<p>Hello ${name},</p>
           <p>Click the link below to verify your account:</p>
           <p><a href="${verifyUrl}">${verifyUrl}</a></p>
           <p>This link expires in 24 hours.</p>`,
  });

  if (phone) {
    await sendSMS({
      to: phone,
      message: `RentFAX Verification Link:\n${verifyUrl}\nExpires in 24 hours.`,
    });
  }

  return { success: true, token };
}
