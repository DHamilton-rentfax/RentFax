"use client";

import { getAddonBySlug } from "@/lib/addons-data";
import { addonCategories } from "../navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import MobileCta from "../mobile-cta";

export function generateStaticParams() {
  return addonCategories.flatMap((c) => c.items.map((i) => ({ slug: i.slug })));
}

export default function AddOnDetailPage({ params }: { params: { slug: string } }) {
  const addon = getAddonBySlug(params.slug);
  if (!addon) return notFound();

  // flatten all items for next/prev nav
  const allItems = addonCategories.flatMap((c) => c.items);
  const currentIndex = allItems.findIndex((i) => i.slug === addon.slug);
  const prevAddon = allItems[currentIndex - 1];
  const nextAddon = allItems[currentIndex + 1];

  return (
    <motion.div
      key={addon.slug}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative max-w-5xl mx-auto py-16 px-6"
    >
      {/* Sticky CTA */}
      <div className="hidden lg:block fixed right-10 top-40 w-64 bg-primary/5 border border-primary rounded-xl p-5">
        <h3 className="text-lg font-semibold mb-3">{addon.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{addon.tagline}</p>
        <Link
          href={`/pricing?selected=${addon.priceId}`}
          className="block w-full text-center bg-primary text-white py-2 rounded-md hover:bg-primary/90"
        >
          Add to Plan →
        </Link>
        <p className="text-xs text-center text-muted-foreground mt-2">
          Available via Pricing page.
        </p>
      </div>

      {/* Header */}
      <div className="text-center mb-12 border-b border-muted pb-8">
        <h1 className="text-4xl font-bold text-primary mb-3">{addon.name}</h1>
        <p className="text-lg text-muted-foreground">{addon.tagline}</p>
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-3 gap-12">
        {/* Overview */}
        <div className="lg:col-span-2">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">Overview</h2>
            <p className="text-muted-foreground leading-relaxed">
              {addon.overview}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">Example Use Case</h2>
            <div className="bg-muted/50 p-6 rounded-lg border">
              <h4 className="font-semibold text-primary mb-2">
                {addon.useCase.title}
              </h4>
              <p className="text-muted-foreground">{addon.useCase.content}</p>
            </div>
          </section>

          {/* Next / Previous Navigation */}
          <div className="flex justify-between mt-16 border-t pt-6">
            {prevAddon ? (
              <Link
                href={`/docs/addons/${prevAddon.slug}`}
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> {prevAddon.name}
              </Link>
            ) : <div />}

            {nextAddon && (
              <Link
                href={`/docs/addons/${nextAddon.slug}`}
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                {nextAddon.name} <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Key Benefits */}
        <div className="lg:col-span-1 space-y-5">
          <section className="bg-muted/50 p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Key Benefits</h3>
            <ul className="space-y-2">
              {addon.keyBenefits.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-1" />
                  <span className="text-muted-foreground text-sm">{b}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
      
      <MobileCta addon={addon} />
    </motion.div>
  );
}
