
import "./globals.css";
import Link from "next/link";
import { AuthProvider } from "@/hooks/use-auth";

export const metadata = {
  title: "RentFAX",
  description: "Rental incident reports, disputes, and fraud protection.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {/* Public Header */}
          <header className="w-full border-b bg-white">
            <nav className="max-w-7xl mx-auto flex justify-between items-center p-4">
              <Link href="/" className="font-bold text-xl">RentFAX</Link>
              <div className="flex gap-4">
                <Link href="/how-it-works">How It Works</Link>
                <Link href="/pricing">Pricing</Link>
                <Link href="/blog">Blog</Link>
                <Link href="/login">Login</Link>
                <Link href="/signup" className="px-3 py-1 bg-blue-600 text-white rounded-md">
                  Sign Up
                </Link>
              </div>
            </nav>
          </header>

          {/* Page Content */}
          <main className="flex-1">{children}</main>

          {/* Public Footer */}
          <footer className="w-full border-t bg-gray-50 p-4 text-center text-sm">
            © {new Date().getFullYear()} RentFAX. All rights reserved.
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
