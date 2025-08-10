'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { acceptInvite } from '@/app/auth/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function AcceptInvitePage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;
  const { toast } = useToast();
  const [message, setMessage] = useState('Checking invite…');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
        setMessage('Invite token is missing.');
        setLoading(false);
        return;
    };

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setMessage('Please log in or sign up to accept this invite.');
        // Redirect to signup with token, so we can come back here after
        router.replace(`/signup?token=${token}`);
        return;
      }
      
      try {
        setMessage('Accepting your invite, please wait...');
        await acceptInvite({ token });
        // Force refresh claims
        await auth.currentUser?.getIdToken(true);
        toast({ title: "Invite Accepted!", description: "Welcome to the team." });
        router.replace('/dashboard');
      } catch (e: any) {
        const errorMessage = e.message || 'Unable to accept invite. It may be invalid or expired.';
        setMessage(errorMessage);
        toast({ title: "Error Accepting Invite", description: errorMessage, variant: 'destructive' });
        setLoading(false);
      }
    });

    return () => unsub();
  }, [token, router, toast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/40 text-center p-4">
        <div className="max-w-md">
            <h1 className="text-2xl font-headline mb-4">Accept Your Invitation</h1>
            <div className="flex items-center justify-center gap-4 bg-card p-6 rounded-lg shadow-md">
                {loading && <Loader2 className="h-6 w-6 animate-spin" />}
                <p className="text-lg">{message}</p>
            </div>
        </div>
    </div>
  );
}
