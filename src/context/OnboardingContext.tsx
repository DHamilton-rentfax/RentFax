"use client";

import { createContext, useContext, useState } from "react";

type OnboardingData = {
  company?: any;
  owner?: any;
  preferences?: any;
  billing?: any;
};

type Ctx = {
  data: OnboardingData;
  update: (section: string, values: any) => void;
};

const OnboardingCtx = createContext<Ctx>({
  data: {},
  update: () => {},
});

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<OnboardingData>({});

  function update(section: string, values: any) {
    setData((prev) => ({ ...prev, [section]: values }));
  }

  return (
    <OnboardingCtx.Provider value={{ data, update }}>
      {children}
    </OnboardingCtx.Provider>
  );
}

export function useOnboarding() {
  return useContext(OnboardingCtx);
}
