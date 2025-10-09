
import ContactClientPage from "./ContactClientPage";

export const metadata = {
  title: "Contact RentFAX | Request a Demo or Talk to Sales",
  description:
    "Get in touch with the RentFAX team. Request a demo, inquire about enterprise solutions, or contact our support specialists for more information.",
  openGraph: {
    title: "Contact RentFAX | Request a Demo or Talk to Sales",
    description:
      "Connect with RentFAX for enterprise inquiries, demos, and partnership opportunities.",
    url: "https://rentfax.io/contact",
    siteName: "RentFAX",
    images: [
      {
        url: "https://rentfax.io/images/og-contact.jpg",
        width: 1200,
        height: 630,
        alt: "Contact RentFAX",
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

export default function ContactPage() {
    return <ContactClientPage />;
}
