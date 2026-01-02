'use client';

import { AuthProvider } from '@/hooks/use-auth';
import { ModalProvider } from '@/contexts/ModalContext';
import ModalRoot from '@/components/ModalRoot';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ModalProvider>
        {children}
        <ModalRoot />
      </ModalProvider>
    </AuthProvider>
  );
}
