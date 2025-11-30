'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

const plans = {
  Free: {
    reports: 0,
    aiInsights: false,
    teamSeats: 1,
    identityCheckPrice: 4.99,
    fullReportPrice: 20.00,
  },
  Starter: {
    reports: 5,
    aiInsights: true,
    teamSeats: 3,
    identityCheckPrice: 4.99,
    fullReportPrice: 20.00,
  },
  Pro: {
    reports: 10,
    aiInsights: true,
    teamSeats: 5,
    identityCheckPrice: 4.99,
    fullReportPrice: 20.00,
  },
  Enterprise: {
    reports: 50,
    aiInsights: true,
    teamSeats: 10,
    identityCheckPrice: 4.99,
    fullReportPrice: 20.00,
  },
};

type Plan = keyof typeof plans;
type PlanContextType = {
  currentPlan: Plan;
  setCurrentPlan: (plan: Plan) => void;
  plans: typeof plans;
};

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export function PlanProvider({ children }: { children: ReactNode }) {
  const [currentPlan, setCurrentPlan] = useState<Plan>('Pro');

  return (
    <PlanContext.Provider value={{ currentPlan, setCurrentPlan, plans }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
}
