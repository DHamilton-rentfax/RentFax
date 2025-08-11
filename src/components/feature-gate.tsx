'use client';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { PLAN_FEATURES, Plan, CompanyStatus } from '@/lib/plan-features';
import Paywall from './paywall';

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
          
          setPlan(currentPlan);
          setStatus(currentStatus);
          setIsAllowed(currentStatus !== 'locked' && !!PLAN_FEATURES[currentPlan]?.[name]);
        } else {
          setIsAllowed(false);
        }
      } catch (error) {
        console.error("Error fetching company plan:", error);
        setIsAllowed(false);
      }
    };

    checkPlan();
  }, [name, claims]);

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
