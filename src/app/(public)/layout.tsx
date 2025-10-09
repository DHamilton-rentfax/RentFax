
"use client";

import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { ModalProvider } from "@/context/ModalContext";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
        <ModalProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ModalProvider>
        <Toaster />
    </AuthProvider>
  );
}
