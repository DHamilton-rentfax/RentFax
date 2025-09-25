
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { acceptInvite } from "@/app/auth/actions";
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function AcceptInvitePage() {
  const params = useParams();
  const token = params?.token as string;
  const router = useRouter();
  const { toast } = useToast();
  const [status, setStatus] = useState("Verifying your invite...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
        setStatus("This invite link is invalid or has expired.");
        return;
    }

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setError("Please sign in or create an account to accept the invite.");
        router.push(`/login?redirect=/invite/${token}`); // Redirect to login, then come back
        return;
      }

      setError(null);
      setStatus("Verifying your identity and invite...");
      
      try {
        await acceptInvite({ token });
        setStatus("Success! You've joined the team. Redirecting you now...");
        toast({ title: "Welcome to the team!", description: "Your account has been configured."});
        setTimeout(() => router.push("/dashboard"), 2000);
      } catch (e: any) {
          setError(e.message || "Failed to accept invite.");
          setStatus("Invite could not be accepted.");
          toast({ title: "Error", description: e.message, variant: "destructive" });
      }
    });

    return () => unsub();
  }, [token, router, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
            <CardTitle className="font-headline text-2xl">Accepting Your Invitation</CardTitle>
            <CardDescription>Please wait while we set up your account.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4 py-8">
            {error ? (
                <>
                    <p className="text-lg text-destructive-foreground bg-destructive p-4 rounded-md">{error}</p>
                    <Button asChild variant="secondary">
                        <Link href="/login">Go to Login</Link>
                    </Button>
                </>
            ) : (
                 <>
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <p className="text-lg text-muted-foreground">{status}</p>
                 </>
            )}
           
        </CardContent>
      </Card>
    </div>
  );
}
