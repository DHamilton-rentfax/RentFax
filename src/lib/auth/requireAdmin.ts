import { adminAuth, adminDb } from "@/firebase/server";

export async function requireAdmin(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) throw new Error("Unauthorized");

  const decoded = await adminAuth.verifyIdToken(token);

  const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
  if (!userDoc.exists) throw new Error("Unauthorized");

  return { uid: decoded.uid, email: decoded.email, role: userDoc.data()?.role };
}
