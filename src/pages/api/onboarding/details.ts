import { adminDb } from "@/firebase/server";
import { getAuth } from "firebase-admin/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("Unauthorized");

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    const userId = decodedToken.uid;

    const { companyType, ein, address, phone } = req.body;

    const companyRef = adminDb.collection("companies").doc(userId);
    await companyRef.set({
      companyType,
      ein,
      address,
      phone,
    }, { merge: true });

    res.status(200).json({ message: "Details saved" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}
