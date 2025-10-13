"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/firebase/client";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  limit,
  getDocs,
} from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"; // Correctly import auth functions
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Invite } from "@/types/invite";

export default function AcceptInvitePage() {
  const { token } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [invite, setInvite] = useState<Invite | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const q = query(
          collection(db, "invites"),
          where("token", "==", token),
          limit(1),
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          setError("Invalid or expired invitation token.");
          setLoading(false);
          return;
        }

        const inviteDoc = snapshot.docs[0];
        const inviteData = { id: inviteDoc.id, ...inviteDoc.data() } as Invite;

        if (inviteData.status !== "PENDING") {
          setError(
            `This invitation has been ${inviteData.status.toLowerCase()}.`,
          );
          setLoading(false);
          return;
        }

        setInvite(inviteData);
        setLoading(false);
      } catch (err) {
        setError("An error occurred while verifying your invitation.");
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const acceptInvite = async () => {
    if (!invite || !password) return;

    try {
      const auth = getAuth();
      // 1. Create a new user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        invite.email,
        password,
      );
      const newUser = userCredential.user;

      if (!newUser) {
        setError("Could not create an account. The email might be in use.");
        return;
      }

      // 2. Update the invite status
      await updateDoc(doc(db, "invites", invite.id), {
        status: "ACCEPTED",
        acceptedAt: serverTimestamp(),
        acceptedBy: newUser.uid,
      });

      // 3. Redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to accept invitation.");
    }
  };

  if (loading) {
    return <p className="text-center p-8">Verifying your invitation...</p>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-red-600">Invitation Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button onClick={() => router.push("/")} className="mt-4">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user) {
    return (
      <div className="text-center p-8">
        <p>
          You are already logged in. Please log out to accept this invitation.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Accept Your Invitation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            You have been invited to join <strong>{invite?.companyName}</strong>{" "}
            as a <strong>{invite?.role}</strong>.
          </p>
          <p>Create a password to accept your invitation.</p>
          <Input
            type="password"
            placeholder="Choose a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
          />
          <Button onClick={acceptInvite} className="w-full">
            Accept Invitation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
