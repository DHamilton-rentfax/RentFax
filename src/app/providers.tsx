'use client';

import { ReactNode } from 'react';
import { ModalProvider } from '@/contexts/ModalContext';
import ModalRoot from '@/components/ModalRoot';

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ModalProvider>
      {children}
      <ModalRoot />
    </ModalProvider>
  );
}