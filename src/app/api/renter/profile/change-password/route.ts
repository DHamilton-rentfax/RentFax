import { NextResponse } from "next/server";
import { authMiddleware } from "@/lib/auth-middleware";
import { auth } from "@/firebase/server"; // Assuming you have server-side auth initialized

export const POST = authMiddleware(async (req, { user }) => {
  const { currentPassword, newPassword } = await req.json();

  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }

  // IMPORTANT: The following is a simplified example. 
  // In a real Firebase application, you cannot directly verify the current password on the server-side with the Admin SDK.
  // The recommended flow is to ask the user to re-authenticate on the client-side.
  // This provides a recent login credential which is required for sensitive operations like changing a password.
  
  // 1. Client-side: Prompt user for their password.
  // 2. Client-side: Use `reauthenticateWithCredential` from the Firebase client SDK.
  //    const credential = EmailAuthProvider.credential(user.email, currentPassword);
  //    await reauthenticateWithCredential(auth.currentUser, credential);
  // 3. Client-side: If re-authentication is successful, then call `updatePassword`.
  //    await updatePassword(auth.currentUser, newPassword);
  // 4. Client-side: If successful, maybe call a server endpoint just to log the change, but the core logic is on the client.

  // For this project, we will simulate the server-side logic for demonstration, 
  // assuming a re-authentication step has already happened.
  
  try {
    // This is NOT how you verify a password with Firebase Admin SDK.
    // We are simulating a check for the purpose of this project.
    // A real implementation would not have access to the user's password hash to compare.
    console.log(`Simulating password change for user: ${user.uid}. A real app would rely on client-side re-authentication.`);

    // In a real scenario, after client-side re-auth, you might just log this event.
    // But to make this endpoint functional for the demo, we'll use the Admin SDK to set the password,
    // acknowledging this is NOT the standard security flow.
    await auth.updateUser(user.uid, {
      password: newPassword,
    });

    // You might also want to invalidate existing sessions for security.
    await auth.revokeRefreshTokens(user.uid);

    return NextResponse.json({ message: "Password updated successfully. You may need to log in again." });

  } catch (error: any) {
    console.error("Error changing password:", error);
    // Firebase errors can be mapped to more user-friendly messages
    let errorMessage = "An error occurred while updating your password.";
    if (error.code === 'auth/weak-password') {
      errorMessage = "The new password is too weak.";
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
});
