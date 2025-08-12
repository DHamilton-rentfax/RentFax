
'use client';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { PLAN_FEATURES, Plan, CompanyStatus } from '@/lib/plan-features';
import Paywall from './paywall';
import { useToast } from '@/hooks/use-toast';

export default function FeatureGate({
  name,
  children,
  fallback,
}: {
  name: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { claims } = useAuth();
  const { toast } = useToast();
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);
  const [plan, setPlan] = useState<Plan>('starter');
  const [status, setStatus] = useState<CompanyStatus>('active');

  useEffect(() => {
    const checkPlan = async () => {
      if (!claims?.companyId) {
        setIsAllowed(false);
        return;
      }

      try {
        const companyRef = doc(db, 'companies', claims.companyId);
        const companySnap = await getDoc(companyRef);
        if (companySnap.exists()) {
          const companyData = companySnap.data();
          const currentPlan = (companyData.plan || 'starter') as Plan;
          const currentStatus = (companyData.status || 'active') as CompanyStatus;
          const aiEnabled = companyData.ai?.enabled ?? true; // Default to on
          
          setPlan(currentPlan);
          setStatus(currentStatus);

          const planHasFeature = PLAN_FEATURES[currentPlan]?.[name];
          const companyAllowsFeature = name.startsWith('ai_') ? aiEnabled : true;
          
          setIsAllowed(currentStatus !== 'locked' && !!planHasFeature && companyAllowsFeature);
        } else {
          setIsAllowed(false);
        }
      } catch (error: any) {
        console.error("Error fetching company plan:", error);
        toast({ title: "Error", description: `Could not verify your plan: ${error.message}`, variant: "destructive" });
        setIsAllowed(false);
      }
    };

    if (claims) {
        checkPlan();
    }
  }, [name, claims, toast]);

  if (isAllowed === null) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Checking plan...
      </div>
    );
  }

  if (!isAllowed) {
    return fallback || <Paywall currentPlan={plan} currentStatus={status} featureName={name} />;
  }

  return <>{children}</>;
}
