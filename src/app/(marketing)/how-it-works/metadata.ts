import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How RentFAX Works | AI-Powered Renter Screening & Fraud Detection",
  description:
    "Learn how RentFAX uses AI to verify renter identities, detect fraud, and streamline the leasing process. A modern solution for landlords and property managers.",
  openGraph: {
    title: "How RentFAX Works | AI-Powered Renter Screening & Fraud Detection",
    description:
      "Discover the step-by-step process RentFAX uses to provide instant, reliable, and compliant renter screening reports.",
    url: "https://rentfax.io/how-it-works",
    siteName: "RentFAX",
    images: [
      {
        url: "https://rentfax.io/og-how-it-works.png",
        width: 1200,
        height: 630,
        alt: "Diagram showing how RentFAX works",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How RentFAX Works | AI-Powered Renter Screening & Fraud Detection",
    description:
      "Learn how RentFAX’s AI-driven platform automates tenant screening, verification, and fraud detection for safer, faster leasing decisions.",
    images: ["https://rentfax.io/og-how-it-works.png"],
  },
};
