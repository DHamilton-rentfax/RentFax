import { adminAuth as firebaseAuthAdmin } from "@/firebase/server";

export const authUser = async (req: Request) => {
  try {
    const header = req.headers.get("Authorization");
    if (!header) {
      return null;
    }
    const token = header.replace("Bearer ", "");
    const decodedToken = await firebaseAuthAdmin.verifyIdToken(token);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role,
    };
  } catch (error) {
    console.error("Auth user error:", error);
    return null;
  }
};
