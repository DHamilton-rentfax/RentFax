
import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Newsreader } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader" });

export const metadata: Metadata = {
  title: "RentFAX — Smarter Risk, Safer Rentals",
  description: "AI risk intelligence for rentals. Score risk, detect fraud, resolve disputes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable}`}>
      <body className="min-h-screen bg-[#FAFAFA] text-[#111] antialiased selection:bg-indigo-200/40">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-black/5 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
            <Link href="/" className="font-bold text-xl tracking-tight">
              <span className="font-[var(--font-newsreader)]">Rent</span>FAX
            </Link>
            <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-700">
              <Link href="/pricing" className="hover:text-black">Pricing</Link>
              <Link href="/blog" className="hover:text-black">Blog</Link>
              <Link href="/docs" className="hover:text-black">Docs</Link>
              <Link href="/about" className="hover:text-black">About</Link>
              <Link href="/contact" className="hover:text-black">Contact</Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm text-zinc-700 hover:text-black">Log in</Link>
              <Link
                href="/signup"
                className="rounded-full bg-black text-white text-sm px-4 py-2 hover:bg-zinc-900"
              >
                Get started
              </Link>
            </div>
          </div>
        </header>

        <main>{children}</main>

        {/* Footer */}
        <footer className="border-t border-black/5 mt-24">
          <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 md:grid-cols-4 text-sm">
            <div>
              <div className="font-semibold">RentFAX</div>
              <p className="mt-3 text-zinc-600">
                AI risk intelligence for rental businesses. Calm, fast, secure.
              </p>
            </div>
            <div>
              <div className="font-medium">Product</div>
              <ul className="mt-3 space-y-2 text-zinc-600">
                <li><Link href="/pricing" className="hover:text-black">Pricing</Link></li>
                <li><Link href="/docs" className="hover:text-black">Documentation</Link></li>
                <li><Link href="/help" className="hover:text-black">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-medium">Company</div>
              <ul className="mt-3 space-y-2 text-zinc-600">
                <li><Link href="/about" className="hover:text-black">About</Link></li>
                <li><Link href="/careers" className="hover:text-black">Careers</Link></li>
                <li><Link href="/partners" className="hover:text-black">Partners</Link></li>
                <li><Link href="/press" className="hover:text-black">Press</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-medium">Trust</div>
              <ul className="mt-3 space-y-2 text-zinc-600">
                <li><Link href="/status" className="hover:text-black">Status</Link></li>
                <li><Link href="/legal/security" className="hover:text-black">Security</Link></li>
                <li><Link href="/legal/terms" className="hover:text-black">Terms</Link></li>
                <li><Link href="/legal/privacy" className="hover:text-black">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mx-auto max-w-7xl px-6 pb-10 text-xs text-zinc-500">
            © {new Date().getFullYear()} RentFAX. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
