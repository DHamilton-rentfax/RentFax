import AboutClientPage from "./AboutClientPage";

export const metadata = {
  title: "About RentFAX | Our Story and Mission",
  description:
    "RentFAX was created after real-world rental losses and fraud experiences. Learn how our mission is building a safer, transparent rental ecosystem for businesses and renters alike.",
  openGraph: {
    title: "About RentFAX | Our Story and Mission",
    description:
      "Discover why RentFAX was founded — to protect property owners, prevent fraud, and create a safer environment for responsible renters.",
    url: "https://rentfax.io/about",
    siteName: "RentFAX",
    images: [
      {
        url: "https://rentfax.io/images/og-about.jpg",
        width: 1200,
        height: 630,
        alt: "About RentFAX - Our Story",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact RentFAX | Request a Demo or Talk to Sales",
    description: "Get in touch with the RentFAX team for sales and support.",
    images: ["https://rentfax.io/images/og-contact.jpg"],
  },
};

export default function AboutPage() {
  return <AboutClientPage />;
}
