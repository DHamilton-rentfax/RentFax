import { adminDb } from "@/firebase/server";
import { getAuth } from "firebase-admin/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("Unauthorized");

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    const userId = decodedToken.uid;

    const notificationsRef = adminDb
      .collection("users")
      .doc(userId)
      .collection("notifications")
      .orderBy("createdAt", "desc");

    const snapshot = await notificationsRef.get();
    const notifications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}
