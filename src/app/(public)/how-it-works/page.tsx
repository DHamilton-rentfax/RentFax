import HowItWorksClientPage from "./HowItWorksClientPage";

// --- SEO metadata for How It Works page ---
export const metadata = {
  title: "How RentFAX Works | AI-Powered Renter Verification & Fraud Detection",
  description:
    "Discover how RentFAX uses AI to simplify renter screening, detect fraud, and manage disputes with full transparency. Smarter rentals. Safer decisions.",
  openGraph: {
    title: "How RentFAX Works | AI-Powered Renter Verification & Fraud Detection",
    description:
      "Learn how RentFAX automates renter verification and fraud detection using AI. Gain instant insights and protect your properties with confidence.",
    url: "https://rentfax.io/how-it-works",
    siteName: "RentFAX",
    images: [
      {
        url: "https://rentfax.io/images/og-how-it-works.jpg", // 👈 Replace with your actual OG image path
        width: 1200,
        height: 630,
        alt: "RentFAX - How It Works",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How RentFAX Works | AI Renter Verification & Fraud Detection",
    description:
      "Smarter rentals. Safer decisions. Learn how RentFAX automates verification and detects risk in seconds.",
    images: ["https://rentfax.io/images/og-how-it-works.jpg"],
  },
};

export default function HowItWorksPage() {
  return <HowItWorksClientPage />;
}
