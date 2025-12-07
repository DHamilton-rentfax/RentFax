"use client";

import UnifiedHeader from "@/components/UnifiedHeader";
import Footer from "@/components/layout/footer";
import "../globals.css";
import BetaWidget from "@/components/BetaWidget";
import { ModalProvider } from "@/contexts/ModalContext";
import ModalRoot from "@/components/ModalRoot";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <ModalProvider>
        <UnifiedHeader />

        <main className="flex-1 pt-[120px]">
          {children}
        </main>

        <Footer />
        <BetaWidget />
        <ModalRoot />
      </ModalProvider>
    </div>
  );
}
