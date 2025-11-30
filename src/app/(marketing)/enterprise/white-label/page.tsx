"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function EnterprisePage() {
  return (
    <div className="bg-white">
      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold mb-6">
          White-Label Rental Intelligence
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Deploy the full RentFAX platform under your own branding.  
          Enterprise-grade fraud detection, renter intelligence, dispute
          automation, and AI risk scoring — all white-labeled for your company.
        </p>

        <Button size="lg" asChild>
          <a href="/contact?type=enterprise">Request Enterprise Demo</a>
        </Button>
      </section>

      {/* FEATURES */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          <FeatureCard
            title="Full White-Label"
            description="Custom domains, your branding, your dashboards — powered by RentFAX’s intelligence engine."
          />
          <FeatureCard
            title="Multi-Tenant Architecture"
            description="Add unlimited clients, offices, franchises, or partners under your private instance."
          />
          <FeatureCard
            title="AI-Powered Risk Engine"
            description="Our industry-first fraud detection + renter scoring AI is included out of the box."
          />
          <FeatureCard
            title="Tenant Roles & Permissions"
            description="Control which admin teams, agents, stores, or departments can access each feature."
          />
          <FeatureCard
            title="Custom Integrations"
            description="API access for CRM syncing, property management systems, and internal tools."
          />
          <FeatureCard
            title="Enterprise SLAs"
            description="24/7 support, 99.9% uptime guarantee, dedicated engineering channels."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to White-Label RentFAX?</h2>
        <p className="text-lg text-gray-600 mb-8">
          Get a demo and pricing tailored to your organization.
        </p>

        <Button size="lg" asChild>
          <a href="/contact?type=enterprise">Book an Enterprise Demo</a>
        </Button>
      </section>
    </div>
  );
}

function FeatureCard({ title, description }: any) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
