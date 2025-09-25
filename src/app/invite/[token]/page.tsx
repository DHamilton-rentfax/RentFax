
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db, auth } from "@/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, doc, updateDoc, setDoc } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function AcceptInvitePage() {
  const params = useParams();
  const token = params?.token as string;
  const router = useRouter();
  const [status, setStatus] = useState("Verifying your invite...");

  useEffect(() => {
    if (!token) {
        setStatus("This invite link is invalid or has expired.");
        return;
    }

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setStatus("Please sign in or create an account to accept the invite.");
        router.push(`/login?redirect=/invite/${token}`); // Redirect to login, then come back
        return;
      }

      setStatus("Verifying invite...");
      const q = query(collection(db, "invites"), where("token", "==", token));
      const snap = await getDocs(q);

      if (snap.empty) {
        setStatus("This invite is not valid or may have been revoked.");
        return;
      }

      const inviteDoc = snap.docs[0];
      const inviteData = inviteDoc.data();

      if (inviteData.accepted) {
        setStatus("This invite has already been accepted.");
        router.push("/admin/blogs");
        return;
      }

      // Update user's role in a 'users' collection
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: inviteData.role,
      }, { merge: true });

      // Mark the invite as accepted
      await updateDoc(doc(db, "invites", inviteDoc.id), { accepted: true });

      setStatus("Success! You've joined the team. Redirecting you now...");
      setTimeout(() => router.push("/admin/blogs"), 2000);
    });

    return () => unsub();
  }, [token, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
            <CardTitle>Accepting Your Invitation</CardTitle>
            <CardDescription>Please wait while we set up your account.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center gap-4 py-8">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
            <p className="text-lg text-gray-700">{status}</p>
        </CardContent>
      </Card>
    </div>
  );
}
