import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "RentFAX — Verify Renters Instantly",
  description:
    "RentFAX helps property managers and landlords verify renter reliability, detect fraud, and manage disputes with AI-powered insights.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen bg-background text-foreground antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
