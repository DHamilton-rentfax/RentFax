// src/app/layout.tsx
import "./globals.css";
import Link from "next/link";
import { AuthProvider } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import BannerMessage from "@/components/banner-message";

export const metadata = {
  title: "RentFAX",
  description: "Rental incident reports, disputes, and fraud protection.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
            <BannerMessage />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
