
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function BillingPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRedirect = async () => {
    setLoading(true);
    try {
      const createPortalSession = httpsCallable(functions, 'createBillingPortalSession');
      const res: any = await createPortalSession();
      if (res?.data?.url) {
        window.location.href = res.data.url;
      } else {
        throw new Error('Could not create a portal session.');
      }
    } catch (err: any) {
       toast({ title: 'Error', description: err.message, variant: 'destructive'});
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Billing & Subscription</h3>
        <p className="text-sm text-muted-foreground">
            Manage your subscription, invoices, and payment methods.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Billing</CardTitle>
          <CardDescription>You will be securely redirected to our payment partner, Stripe, to manage your subscription.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleRedirect} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Open Customer Portal
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
