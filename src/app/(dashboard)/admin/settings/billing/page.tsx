"use client";

import { useState , useEffect } from "react";
import { httpsCallable } from "firebase/functions";
import { Loader2 } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { functions , db } from "@/firebase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import Protected from "@/components/protected";

export default function BillingPage() {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [company, setCompany] = useState<any>(null);
  const { toast } = useToast();
  const { claims } = useAuth();

  useEffect(() => {
    if (!claims?.companyId) return;
    const fetchCompany = async () => {
      setLoadingData(true);
      const companyRef = doc(db, "companies", claims.companyId);
      const companySnap = await getDoc(companyRef);
      if (companySnap.exists()) {
        setCompany(companySnap.data());
      }
      setLoadingData(false);
    };
    fetchCompany();
  }, [claims?.companyId]);

  const handleRedirect = async () => {
    setLoading(true);
    try {
      const createPortalSession = httpsCallable(
        functions,
        "createBillingPortalSession",
      );
      const res: any = await createPortalSession();
      if (res?.data?.url) {
        window.location.href = res.data.url;
      } else {
        throw new Error(
          "Could not create a portal session. Have you configured Stripe?",
        );
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Protected roles={["owner", "manager"]}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold font-headline">Billing</h1>
        <Card>
          <CardHeader>
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription>
              Manage your subscription and payment methods via our secure
              payment partner, Stripe.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingData ? (
              <p>Loading plan...</p>
            ) : (
              <div className="flex items-center gap-4 p-4 bg-secondary rounded-md">
                <p>
                  Your current plan:{" "}
                  <span className="font-bold capitalize">
                    {company?.plan || "..."}
                  </span>
                </p>
                <Badge>{company?.status || "..."}</Badge>
              </div>
            )}

            <Button onClick={handleRedirect} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Open Customer Portal
            </Button>
          </CardContent>
        </Card>
      </div>
    </Protected>
  );
}
