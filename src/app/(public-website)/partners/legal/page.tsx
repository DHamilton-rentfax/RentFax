"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";

export default function LegalPartnerPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <h1 className="text-5xl font-bold">Partner with RentFAX: Legal</h1>
        <p className="text-xl mt-4 text-muted-foreground">
          The essential tool for legal professionals in the rental industry.
        </p>
        <Button size="lg" className="mt-8" asChild>
          <Link href="/partners/legal/signup">Become a Partner</Link>
        </Button>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-secondary">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Gain a Competitive Edge in Your Practice
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Strengthen Your Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Utilize our comprehensive renter reports as evidence in eviction
                  proceedings and other legal matters.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Save Time and Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Access all the information you need in one place, reducing the
                  time spent on discovery and research.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Attract More Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Differentiate your firm by offering specialized services
                  powered by RentFAX's unique data insights.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Features for Legal Professionals
          </h2>
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-start space-x-4">
              <Check className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Court-Ready Reports</h3>
                <p className="text-muted-foreground">
                  Generate detailed, court-ready reports that clearly outline a
                  renter's history.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Check className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Secure Document Storage</h3>
                <p className="text-muted-foreground">
                  Securely store and manage all your case-related documents in
                  one centralized location.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Check className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Expert Witness Support</h3>
                <p className="text-muted-foreground">
                  Our team of experts can provide testimony and support to help
                  you win your cases.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
