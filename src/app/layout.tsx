import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RentFAX – Verify Renters, Protect Your Business",
  description: "AI-powered renter verification and dispute resolution platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-background text-foreground flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pt-16">{/* Add padding-top to avoid content being hidden by fixed header */}
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
