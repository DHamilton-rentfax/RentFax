import { NextResponse } from "next/server";
import { authMiddleware } from "@/lib/auth-middleware";
import { auth } from "@/firebase/server";

export const POST = authMiddleware(async (req, { user }) => {
  try {
    // Disable the user in Firebase Authentication
    await auth.updateUser(user.uid, { disabled: true });

    // Optionally, you can also update your database to reflect this status
    // For example, in Firestore:
    // await adminDb.collection("renters").doc(user.uid).update({ status: "inactive" });

    // Invalidate user's sessions
    await auth.revokeRefreshTokens(user.uid);

    return NextResponse.json({ message: "Account deactivated successfully." });
  } catch (error) {
    console.error("Error deactivating account:", error);
    return NextResponse.json({ error: "Failed to deactivate account." }, { status: 500 });
  }
});
