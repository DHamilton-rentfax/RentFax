
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '@/firebase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { toast } = useToast();

  const [verificationValue, setVerificationValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('No verification token found. Please use the link provided in your notification.');
    }
  }, [token]);

  const handleVerification = async () => {
    if (!token || !verificationValue) {
      setError('Please enter the required verification value.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/renter/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, verificationValue }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Verification failed. Please check your information and try again.');
      }

      // Sign in with the custom token from the server
      const userCredential = await signInWithCustomToken(auth, data.customToken);
      const renterId = userCredential.user.uid;
      
      toast({
        title: 'Verification Successful',
        description: 'You are now being redirected to your portal.',
      });
      
      // Redirect to the renter dashboard, passing the renterId
      router.push(`/renter/dashboard?rid=${renterId}`);

    } catch (e: any) {
      setError(e.message);
      toast({
        title: 'Verification Failed',
        description: e.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl">Secure Verification</CardTitle>
          <CardDescription>
            Please confirm your identity to securely access your rental information.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {error && <div className="text-destructive text-sm font-medium bg-destructive/10 p-3 rounded-md">{error}</div>}
          <div className="grid gap-2">
            <Label htmlFor="verificationValue">Last 4 of Phone or License</Label>
            <Input
              id="verificationValue"
              placeholder="e.g., 4567"
              maxLength={4}
              value={verificationValue}
              onChange={(e) => setVerificationValue(e.target.value)}
              disabled={loading || !token}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleVerification} disabled={loading || !token} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Verifying...' : 'Access My Portal'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
