"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CheckCircle,
  ShieldCheck,
  LineChart,
  Users,
  TrendingDown,
  AlertTriangle,
  BarChart3,
} from "lucide-react";
import { useState, useEffect } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/client";
import { useToast } from "@/hooks/use-toast";
import CountUp from "react-countup";

export default function LandlordsPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "landlord_leads"), { email, createdAt: serverTimestamp() });
      setSubmitted(true);
      toast({
        title: "Success!",
        description: "We’ll reach out soon with early access details.",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* HERO */}
      <section className="text-center py-28 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
          Protect Your Properties with <span className="text-yellow-300">AI-Powered Screening</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-blue-100">
          RentFAX detects fraud, predicts tenant reliability, and safeguards landlord income — before
          the lease is signed.
        </p>

        <div className="flex justify-center gap-4 mt-8">
          <Button size="lg" variant="secondary" className="font-semibold">
            Run a Report
          </Button>
          <Button size="lg" className="bg-yellow-400 text-black hover:bg-yellow-300 font-semibold">
            Book a Demo
          </Button>
        </div>

        {/* INDUSTRY STATS */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16 text-center">
          {[
            {
              icon: <AlertTriangle className="h-8 w-8 text-yellow-300 mx-auto mb-3" />,
              label: "U.S. Rent Fraud Losses (2024)",
              value: 3.2,
              suffix: "B",
              subtext: "in damages and unpaid rent annually",
            },
            {
              icon: <TrendingDown className="h-8 w-8 text-yellow-300 mx-auto mb-3" />,
              label: "Eviction Filings per Year",
              value: 3.6,
              suffix: "M",
              subtext: "cases — most from unverified renters",
            },
            {
              icon: <BarChart3 className="h-8 w-8 text-yellow-300 mx-auto mb-3" />,
              label: "Bad Tenant Rate",
              value: 1,
              suffix: "/6",
              subtext: "renters cause payment or property issues",
            },
          ].map((stat) => (
            <div key={stat.label}>
              {stat.icon}
              <h3 className="text-4xl font-extrabold text-white">
                <CountUp end={stat.value} duration={3} decimals={stat.suffix === 'B' ? 1 : 0} />{stat.suffix}
              </h3>
              <p className="text-blue-100 font-medium">{stat.label}</p>
              <p className="text-sm text-blue-200">{stat.subtext}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-white border-t">
        <h2 className="text-3xl font-semibold text-center mb-10">How RentFAX Works</h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto px-6">
          {[
            {
              title: "1. Upload Applicant",
              desc: "Upload a tenant application or connect your PMS. RentFAX analyzes it instantly.",
            },
            {
              title: "2. Verify Identity",
              desc: "AI cross-checks documents, SSNs, and paystubs to catch fraud within seconds.",
            },
            {
              title: "3. Get Risk Score",
              desc: "Receive a transparent AI-generated Renter Trust Index (RTI) with key behavior factors.",
            },
            {
              title: "4. Decide Confidently",
              desc: "Accept or reject with full confidence backed by national rental intelligence data.",
            },
          ].map((s) => (
            <Card key={s.title} className="shadow-sm border hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{s.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">{s.desc}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* STATS / IMPACT */}
      <section className="py-20 bg-slate-50 text-center">
        <h2 className="text-3xl font-semibold mb-12">The Real Cost of Bad Screening</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto px-6">
          {[
            {
              title: "$3.2B+",
              desc: "annual landlord losses due to fraudulent tenant applications",
            },
            {
              title: "41%",
              desc: "of small landlords experience unpaid rent or damage in the first year",
            },
            {
              title: "72%",
              desc: "say screening is their biggest administrative burden",
            },
          ].map((stat) => (
            <Card key={stat.title} className="border shadow-sm hover:shadow-md transition bg-white">
              <CardContent className="pt-6">
                <p className="text-5xl font-extrabold text-blue-700 mb-2">{stat.title}</p>
                <p className="text-gray-600">{stat.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-gray-500 max-w-2xl mx-auto mt-8">
          RentFAX helps you avoid these losses — turning tenant data into predictive insights that
          safeguard your revenue.
        </p>
      </section>

      {/* VALUE PROPOSITIONS */}
      <section className="py-20 bg-white border-t">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Why Landlords Choose <span className="text-blue-600">RentFAX</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
          {[
            "Detect falsified documents and identity fraud with 98% accuracy.",
            "Predict missed rent payments before they happen using behavioral AI.",
            "Save up to 80% in screening costs vs. legacy background checks.",
            "Stay fully compliant with FCRA, HUD, and HIPAA frameworks.",
            "Benchmark tenant risk using nationwide RentFAX data intelligence.",
            "Display your 'Protected by RentFAX' trust badge on listings.",
          ].map((benefit) => (
            <Card key={benefit}>
              <CardHeader className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <CardTitle className="text-base font-medium">{benefit}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-slate-50 border-t">
        <h2 className="text-3xl font-semibold text-center mb-12">Trusted by Leading Property Firms</h2>
        <div className="flex flex-col md:flex-row gap-6 justify-center max-w-5xl mx-auto px-6">
          {[
            {
              name: "Karen D.",
              role: "Property Manager, UrbanStay",
              quote:
                "RentFAX saved us thousands in lost rent by catching fake paystubs. It’s now part of every tenant check we run.",
            },
            {
              name: "David L.",
              role: "Landlord, 14 Units",
              quote:
                "Before RentFAX, I relied on instinct. Now I know who’s reliable and who’s a risk — instantly.",
            },
            {
              name: "Sarah M.",
              role: "Regional Housing Director",
              quote:
                "We standardized screening across our offices with RentFAX. Compliance headaches? Gone.",
            },
          ].map((t) => (
            <Card key={t.name} className="md:w-1/3 border shadow-sm hover:shadow-md transition">
              <CardContent className="pt-6">
                <p className="italic text-gray-600 mb-4">“{t.quote}”</p>
                <p className="font-semibold text-gray-900">{t.name}</p>
                <p className="text-sm text-gray-500">{t.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <h2 className="text-4xl font-bold mb-4">Join the Future of Rental Intelligence</h2>
        <p className="text-lg text-blue-100 mb-8">
          Protect your properties, reduce risk, and make data-driven tenant decisions in minutes.
        </p>
        {submitted ? (
          <p className="text-green-200 text-lg">Thank you! We’ll be in touch soon.</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto"
          >
            <Input
              type="email"
              placeholder="you@company.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-gray-800 bg-white"
            />
            <Button
              type="submit"
              size="lg"
              className="bg-yellow-400 text-black font-semibold hover:bg-yellow-300"
            >
              Join Waitlist
            </Button>
          </form>
        )}
      </section>
    </main>
  );
}
