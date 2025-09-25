
import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Newsreader } from "next/font/google";
import Script from "next/script";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader" });

export const metadata: Metadata = {
  title: "RentFAX — Smarter Risk, Safer Rentals",
  description: "AI risk intelligence for rentals. Score risk, detect fraud, resolve disputes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-indigo-200/40">
        <AuthProvider>
            <main>{children}</main>
            <Toaster />
        </AuthProvider>
        {/* Placeholder for a third-party chat widget like Crisp or Intercom */}
        {/* Replace `YOUR_WEBSITE_ID` with your actual ID from the chat provider */}
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
