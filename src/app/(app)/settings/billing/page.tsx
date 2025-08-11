'use client';
import { useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Loader2 } from 'lucide-react';
import Protected from '@/components/protected';
import { useToast } from '@/hooks/use-toast';

export default function BillingPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const openPortal = async () => {
    setLoading(true);
    try {
      const call = httpsCallable(functions, 'createBillingPortalSession');
      const res: any = await call({});
      window.location.href = res.data.url;
    } catch (e: any) {
      toast({
        title: 'Error',
        description: e.message || 'Unable to open billing portal. Please contact support.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Protected roles={['owner', 'manager']}>
      <div className="max-w-4xl mx-auto p-4 md:p-10">
        <h1 className="text-2xl md:text-3xl font-headline mb-6">Billing & Subscription</h1>
        <Card>
          <CardHeader>
            <CardTitle>Manage Your Plan</CardTitle>
            <CardDescription>
              View invoices, update payment methods, and change your subscription plan via our secure Stripe customer portal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You will be redirected to Stripe to manage your billing information securely.
            </p>
            <Button onClick={openPortal} disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="mr-2 h-4 w-4" />
              )}
              Open Customer Portal
            </Button>
          </CardContent>
        </Card>
      </div>
    </Protected>
  );
}
