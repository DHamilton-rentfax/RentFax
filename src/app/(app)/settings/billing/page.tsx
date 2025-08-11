'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Protected from '@/components/protected';

export default function BillingPage() {
  const billingPortalUrl = process.env.NEXT_PUBLIC_BILLING_PORTAL_BASE || '#';

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
            <Button asChild>
              <a href={billingPortalUrl} target="_blank" rel="noopener noreferrer">
                Open Customer Portal <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Protected>
  );
}
