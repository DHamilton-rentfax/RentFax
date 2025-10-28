import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ModalProvider } from "@/context/ModalContext";

export const metadata = {
  title: "RentFAX — Verify Renters Instantly",
  description:
    "RentFAX helps property managers and landlords verify renter reliability, detect fraud, and manage disputes with AI-powered insights.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
          <AuthProvider>
            <ModalProvider>
              {children}
              <Toaster />
            </ModalProvider>
          </AuthProvider>
      </body>
    </html>
  );
}