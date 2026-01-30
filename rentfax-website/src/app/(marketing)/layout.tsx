// src/app/(marketing)/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.rentfax.io"),
  title: {
    default: "RentFAX — Rental Risk, Fraud & Trust Intelligence",
    template: "%s | RentFAX",
  },
  description:
    "RentFAX is a rental risk and fraud intelligence platform for landlords, agencies, and rental companies.",
  openGraph: {
    type: "website",
    siteName: "RentFAX",
    url: "https://www.rentfax.io",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
