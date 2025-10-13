
'use client';

import { useEffect, useState } from "react";
import { auth, functions } from "@/lib/firebase-client";
import { ADDON_CATALOG, Addon } from "@/lib/addons";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { httpsCallable } from "firebase/functions";


export default function BillingDashboard() {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [activeAddons, setActiveAddons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string|null>(null);
  const [reactivatingId, setReactivatingId] = useState<string|null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
      setLoading(true);
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/billing/addons", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.error) {
        toast({ title: 'Error', description: data.error, variant: 'destructive'});
        setLoading(false);
        return;
      }
      setAddons(data.catalog);
      setActiveAddons(data.active);
      setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function cancelAddon(addonId: string) {
    setCancellingId(addonId);
    try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch("/api/billing/cancel-addon", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ addonId }),
        });
        const data = await res.json();
        if (data.success) {
            toast({ title: "Add-on Canceled", description: `${addonId} has been removed from your subscription.` });
            await fetchData(); // Refresh data
        } else {
            throw new Error(data.error || "Failed to cancel add-on");
        }
    } catch(e: any) {
        toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
        setCancellingId(null);
    }
  }

  async function reactivateAddon(addonId: string) {
    setReactivatingId(addonId);
    try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch("/api/billing/reactivate-addon", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ addonId }),
        });
        const data = await res.json();
        if (data.url) {
            window.location.href = data.url; // Redirect to Stripe
        } else {
            throw new Error(data.error || "Failed to reactivate add-on.");
        }
    } catch(e: any) {
        toast({ title: 'Error reactivating add-on', description: e.message, variant: 'destructive' });
    } finally {
        setReactivatingId(null);
    }
  }


  const handlePortalRedirect = async () => {
    setLoading(true);
    try {
      const createPortalSession = httpsCallable(functions, 'createBillingPortalSession');
      const res: any = await createPortalSession();
      if (res?.data?.url) {
        window.location.href = res.data.url;
      } else {
        throw new Error('Could not create a portal session. Have you configured Stripe?');
      }
    } catch (err: any) {
       toast({ title: 'Error', description: err.message, variant: 'destructive'});
       setLoading(false);
    }
  };

  if (loading) {
    return <p className="p-6">Loading billing info...</p>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold font-headline">Billing & Add-Ons</h1>

        <Card>
            <CardHeader>
                <CardTitle>Manage Add-Ons</CardTitle>
                 <CardDescription>Activate, deactivate, or manage add-ons for your subscription.</CardDescription>
            </CardHeader>
            <CardContent>
                {addons.length === 0 ? (
                    <p className="text-muted-foreground">No add-ons available for purchase.</p>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                    {addons.map((addon) => {
                        const isActive = activeAddons.some(active => addon.id.startsWith(active));
                        const isCancelling = cancellingId === addon.id;
                        const isReactivating = reactivatingId === addon.id;

                        return (
                        <Card key={addon.id} className="flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-lg">{addon.name}</CardTitle>
                                <CardDescription>{addon.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="font-bold">
                                ${addon.monthly}/mo or ${addon.annual}/yr
                                </p>
                            </CardContent>
                            <CardFooter>
                                {isActive ? (
                                    <Button
                                        onClick={() => cancelAddon(addon.id)}
                                        variant="destructive"
                                        size="sm"
                                        disabled={isCancelling}
                                    >
                                        {isCancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Cancel Add-on
                                    </Button>
                                ) : (
                                     <Button
                                        onClick={() => reactivateAddon(addon.id)}
                                        variant="default"
                                        size="sm"
                                        disabled={isReactivating}
                                    >
                                        {isReactivating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Re-Activate
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    )})}
                    </div>
                )}
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Manage Subscription</CardTitle>
                <CardDescription>
                    Update your payment method, view invoices, or cancel your subscription via the secure Stripe customer portal.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <Button onClick={handlePortalRedirect} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Open Customer Portal
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
