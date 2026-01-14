'use client';

import { createContext, useContext } from 'react';

type ImpersonationContextValue = {
  isImpersonating: boolean;
  orgName?: string;
};

const ImpersonationContext = createContext<ImpersonationContextValue>({
  isImpersonating: false,
});

export function useImpersonation() {
  return useContext(ImpersonationContext);
}

export function ImpersonationProvider({
  value,
  children,
}: {
  value: ImpersonationContextValue;
  children: React.ReactNode;
}) {
  return (
    <ImpersonationContext.Provider value={value}>
      {children}
    </ImpersonationContext.Provider>
  );
}
