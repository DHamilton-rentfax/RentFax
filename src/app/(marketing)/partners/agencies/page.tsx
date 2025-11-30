"use client";
import { Check } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AgencyPartnerPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <h1 className="text-5xl font-bold">Partner with RentFAX: Agencies</h1>
        <p className="text-xl mt-4 text-muted-foreground">
          Empower your agency with the industry's leading rental intelligence platform.
        </p>
        <Button size="lg" className="mt-8" asChild>
          <Link href="/partners/agencies/signup">Become a Partner</Link>
        </Button>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-secondary">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Partner with RentFAX?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Streamline Collections</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Access comprehensive renter reports to prioritize and streamline your
                  collections process.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Increase Recovery Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Leverage our data-driven insights to improve your recovery rates on
                  unpaid rent and damages.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Grow Your Business</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Gain a competitive edge and attract more clients by offering
                  RentFAX reports as part of your services.
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
            Features for Collection Agencies
          </h2>
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-start space-x-4">
              <Check className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Instant Renter Screening</h3>
                <p className="text-muted-foreground">
                  Quickly access detailed reports on a renter's history,
                  including payment history, evictions, and more.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Check className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Fraud Detection</h3>
                <p className="text-muted-foreground">
                  Our AI-powered fraud detection helps you identify and flag
                  high-risk individuals.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Check className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Customizable Reporting</h3>
                <p className="text-muted-foreground">
                  Tailor reports to your specific needs and easily share them
                  with your team and clients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
