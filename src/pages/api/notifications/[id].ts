import { adminDb } from "@/firebase/server";
import { getAuth } from "firebase-admin/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("Unauthorized");

  const { id } = req.query;

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    const userId = decodedToken.uid;

    const notificationRef = adminDb
      .collection("users")
      .doc(userId)
      .collection("notifications")
      .doc(id as string);

    await notificationRef.update({ read: true });

    res.status(200).send("Notification marked as read");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}
