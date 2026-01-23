import { adminAuth } from "@/firebase/server";

export async function verifySuperAdmin(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) throw new Error("Unauthorized");

  const decoded = await adminAuth.verifyIdToken(token);
  if (decoded.role !== "super_admin") {
    throw new Error("Forbidden");
  }

  return decoded;
}
