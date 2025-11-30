import * as functions from "firebase-functions";
import { getFirestore } from "firebase-admin/firestore";
import { sendEmail } from "./email";
import { sendSMS } from "./sms";
import { sendPush } from "./push";

const db = getFirestore();

exports.dispatchNotification = functions.firestore
  .document("notifications/{id}")
  .onCreate(async (snap) => {
    const data = snap.data();

    // EMAIL
    if (data.channels.includes("email")) {
      await sendEmail({
        toUserId: data.userId,
        subject: data.title,
        html: data.message
      });
    }

    // SMS
    if (data.channels.includes("sms")) {
      await sendSMS({
        toUserId: data.userId,
        message: data.message
      });
    }

    // PUSH
    if (data.channels.includes("push")) {
      await sendPush({
        userId: data.userId,
        title: data.title,
        body: data.message
      });
    }
  });
