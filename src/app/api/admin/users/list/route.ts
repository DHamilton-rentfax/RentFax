
import { NextResponse } from "next/server";
import { initFirebaseAdmin } from "@/firebase/admin-config";
import { getAuth } from "firebase-admin/auth";

// Helper to initialize Firebase Admin
async function initializeFirebase() {
  const admin = await initFirebaseAdmin();
  return getAuth(admin);
}

// GET request handler to list admin and super_admin users
export async function GET(request: Request) {
  try {
    const auth = await initializeFirebase();

    // Check for Super Admin role (assuming a middleware or prior check sets this)
    // This is a placeholder for your actual auth check
    // const { user } = await checkAuth(request); 
    // if (user.role !== 'SUPER_ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    // }

    const listUsersResult = await auth.listUsers();
    const allUsers = listUsersResult.users;

    // Filter for admins and super_admins
    const staff = allUsers
      .filter(user => user.customClaims?.role === 'ADMIN' || user.customClaims?.role === 'SUPER_ADMIN')
      .map(user => ({
        id: user.uid,
        name: user.displayName || 'Unnamed User',
        role: user.customClaims?.role || 'No Role',
      }));

    return NextResponse.json(staff);

  } catch (error) {
    console.error("Failed to list users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
