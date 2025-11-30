"use client";

import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ModalProvider } from "@/contexts/ModalContext";
import ModalManager from "@/components/modals/ModalManager";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ModalProvider>
        {children}
        <ModalManager />
        <Toaster />
      </ModalProvider>
    </AuthProvider>
  );
}
