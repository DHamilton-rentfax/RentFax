
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Users, Scale, Car, AlertTriangle } from "lucide-react";

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
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-b from-background to-muted/30">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Our Story
        </motion.h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Born from experience. Built for protection. Designed for trust.
        </p>
      </section>

      {/* Founder Story */}
      <section className="py-20 px-6 md:px-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6">
              The Real Story Behind RentFAX
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              RentFAX wasn’t born in a boardroom — it was built out of necessity.
              After years of renting vehicles and dealing with renters who
              violated contracts, caused property damage, filed false claims,
              and even stole cars, our founder decided enough was enough.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              From unauthorized drivers to vehicles being smoked in and destroyed,
              the pattern was clear: businesses were exposed, and bad actors faced
              little to no accountability. What began as personal frustration evolved
              into a mission — to protect business owners, property managers, and
              responsible renters through transparency and verified accountability.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              RentFAX exists to make sure that no one has to go through those same
              losses again. It’s about fairness, safety, and giving every renter the
              opportunity to build trust through proven responsibility.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl overflow-hidden shadow-xl border bg-muted/30"
          >
            <img
              src="/images/founder-story.jpg"
              alt="RentFAX Mission"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Our Mission</h2>
          <p className="max-w-3xl mx-auto text-muted-foreground leading-relaxed">
            To create a safe and transparent environment where businesses can
            confidently rent their property, vehicles, or equipment — knowing that
            every renter is verified, accountable, and part of a trusted network.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              icon: <ShieldCheck className="h-10 w-10 text-primary" />,
              title: "Protection First",
              text: "We ensure every renter and rental company has access to transparent reports and verified histories.",
            },
            {
              icon: <Users className="h-10 w-10 text-primary" />,
              title: "Community Trust",
              text: "RentFAX builds trust between renters and companies through consistent accountability and dispute resolution.",
            },
            {
              icon: <Scale className="h-10 w-10 text-primary" />,
              title: "Fairness & Responsibility",
              text: "Our platform is designed to empower honest renters while holding negligent ones accountable.",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="bg-background border rounded-2xl shadow-md p-8 text-center"
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 px-6 md:px-20 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            We envision a world where every rental transaction — from homes to
            cars to heavy equipment — is rooted in trust. Where businesses feel
            confident and renters are rewarded for responsibility.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            RentFAX is more than a verification system — it’s the foundation for
            the future of fair, accountable renting.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center bg-gradient-to-b from-muted/30 to-background">
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-6"
        >
          Join Us in Building a Safer Rental Future
        </motion.h3>
        <p className="text-muted-foreground mb-10 max-w-2xl mx-auto">
          Whether you’re a rental business, a property manager, or a renter —
          RentFAX gives you the tools to protect your assets and your reputation.
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
