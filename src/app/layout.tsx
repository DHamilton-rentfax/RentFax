
import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });


export const metadata: Metadata = {
  title: "RentFAX — Smarter Risk, Safer Rentals",
  description: "AI risk intelligence for rentals. Score risk, detect fraud, resolve disputes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-indigo-200/40">
        <AuthProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster />
        </AuthProvider>
        <Script
            id="crisp-chat"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
                __html: `
            window.$crisp=[];
            window.CRISP_WEBSITE_ID="YOUR_WEBSITE_ID";
            (function(){
                var d=document;
                var s=d.createElement("script");
                s.src="https://client.crisp.chat/l.js";
                s.async=1;
                d.getElementsByTagName("head")[0].appendChild(s);
            })();
            `,
            }}
        />
      </body>
    </html>
  );
}
