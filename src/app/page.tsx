import type { Metadata } from "next";
import HomePageClient from "@/components/layout/HomePageClient";

export const metadata: Metadata = {
  title: "RentFAX: AI-Powered Renter Verification & Fraud Prevention",
  description:
    "Verify renters instantly, prevent fraud, and reduce losses with RentFAX's AI-driven identity verification, rental history checks, and risk intelligence platform for rental businesses worldwide.",
  openGraph: {
    title: "RentFAX: AI-Powered Renter Verification & Fraud Prevention",
    description:
      "AI-powered identity verification, fraud detection, and risk intelligence for property, vehicle, and equipment rentals worldwide.",
    url: "https://www.rentfax.io",
    siteName: "RentFAX",
    images: [
      {
        url: "https://www.rentfax.io/og/home.png",
        width: 1200,
        height: 630,
        alt: "RentFAX – Rental Risk & Fraud Intelligence Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RentFAX: AI-Powered Renter Verification & Fraud Prevention",
    description:
      "AI-powered identity verification, fraud detection, and risk intelligence for property, vehicle, and equipment rentals worldwide.",
    images: ["https://www.rentfax.io/og/home.png"],
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
