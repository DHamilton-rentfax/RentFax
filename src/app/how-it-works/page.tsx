
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  ShieldCheck,
  FileSearch,
  Users,
  BarChart3,
  AlertTriangle,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) =>
    setOpenFaq(openFaq === index ? null : index);

  const faqs = [
    {
      q: "What makes RentFAX different from other tenant screening tools?",
      a: "RentFAX uses AI and cross-database verification to detect fraud and duplicate identities in real time, unlike traditional screening platforms that rely only on static data sources.",
    },
    {
      q: "Can renters dispute a report?",
      a: "Yes. Renters can log in to view, comment, and dispute any report. The system logs every step, creating a transparent audit trail for compliance and fairness.",
    },
    {
      q: "Is RentFAX compliant with data privacy laws?",
      a: "Absolutely. RentFAX is designed around compliance with major privacy regulations like FCRA, CCPA, and GDPR-equivalent standards. All data is securely stored and access is role-based.",
    },
    {
      q: "Can businesses integrate RentFAX into existing systems?",
      a: "Yes, enterprise customers can use our API or Zapier integration to connect RentFAX with their existing CRM, leasing, and billing tools.",
    },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How RentFAX Works",
    description:
      "Step-by-step process explaining how RentFAX automates renter verification, fraud detection, and dispute resolution.",
    step: [
      {
        "@type": "HowToStep",
        name: "Submit & Verify",
        text: "Start by submitting renter details. Our AI instantly verifies identities and checks databases.",
      },
      {
        "@type": "HowToStep",
        name: "AI Fraud Detection",
        text: "Our Fraud Signal Engine analyzes data to detect duplicates and mismatched records.",
      },
      {
        "@type": "HowToStep",
        name: "Dispute & Decision",
        text: "Review the final report, resolve disputes, and make informed leasing decisions.",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Hero */}
      <section className="text-center py-20 bg-gradient-to-b from-background to-muted/30">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          How RentFAX Works
        </motion.h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A transparent, AI-powered system for screening renters, detecting
          fraud, and managing disputes — all in one place.
        </p>
      </section>

      {/* Animated Timeline */}
      <section className="py-20 px-6 md:px-20 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-14">
            Our 3-Step Process
          </h2>

          <div className="space-y-16 relative before:absolute before:left-1/2 before:top-0 before:h-full before:w-1 before:bg-primary/20 before:-translate-x-1/2">
            {[
              {
                icon: <FileSearch className="h-10 w-10 text-primary" />,
                title: "Submit & Verify",
                text: "Start by submitting a renter report or lookup. Our AI instantly scans databases and verifies identity data.",
              },
              {
                icon: <ShieldCheck className="h-10 w-10 text-primary" />,
                title: "AI Fraud Detection",
                text: "Our Fraud Signal Engine analyzes cross-data patterns to identify mismatched or duplicate renter identities in real time.",
              },
              {
                icon: <Users className="h-10 w-10 text-primary" />,
                title: "Dispute & Decision",
                text: "View the risk report, incident history, and open disputes — then make data-driven leasing decisions confidently.",
              },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.3 }}
                viewport={{ once: true }}
                className="relative flex flex-col md:flex-row items-center gap-6"
              >
                <div className="bg-background shadow-lg p-6 rounded-2xl border flex flex-col items-center text-center md:w-1/2">
                  <div className="mb-4">{step.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 bg-muted/30 text-center">
        <h3 className="text-3xl font-bold mb-10">Why Businesses Choose RentFAX</h3>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 text-left">
          {[
            {
              icon: <BarChart3 className="text-primary h-6 w-6 shrink-0" />,
              text: "Instant renter insights and fraud analysis powered by AI.",
            },
            {
              icon: <AlertTriangle className="text-primary h-6 w-6 shrink-0" />,
              text: "Proactive fraud signal alerts based on duplicate identifiers.",
            },
            {
              icon: <MessageSquare className="text-primary h-6 w-6 shrink-0" />,
              text: "Automated renter communication and dispute resolution.",
            },
            {
              icon: <CheckCircle2 className="text-primary h-6 w-6 shrink-0" />,
              text: "Audit logs, compliance tracking, and full transparency.",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="flex items-start gap-4 bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm"
            >
              {item.icon}
              <p>{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Video Demo */}
      <section className="py-20 bg-background text-center">
        <h3 className="text-3xl font-bold mb-6">See RentFAX in Action</h3>
        <p className="text-muted-foreground mb-8">
          Watch how RentFAX automates verification, flags risk, and improves
          decision accuracy.
        </p>
        <div className="relative mx-auto max-w-3xl aspect-video rounded-xl overflow-hidden shadow-xl border">
          <iframe
            src="https://www.youtube.com/embed/VIDEOLINKHERE"
            title="RentFAX Demo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/20 px-6 md:px-20">
        <h3 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h3>
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border rounded-lg bg-background shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex justify-between items-center p-5 text-left"
              >
                <span className="font-medium">{faq.q}</span>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    openFaq === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaq === idx && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="p-5 border-t text-muted-foreground"
                >
                  {faq.a}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center bg-gradient-to-b from-muted/20 to-background">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-6"
        >
          Smarter Rentals. Safer Decisions.
        </motion.h2>
        <p className="text-muted-foreground mb-10">
          Join the network of verified landlords and businesses that trust
          RentFAX for secure, transparent renter verification.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/pricing">
            <Button size="lg" className="bg-primary text-primary-foreground">
              View Plans
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" size="lg">
              Talk to Sales
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

    