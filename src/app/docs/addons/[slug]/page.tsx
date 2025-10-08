'''import { getAddonBySlug } from "@/lib/addons-data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

export default function AddonDetailPage({ params }: { params: { slug: string } }) {
  const addon = getAddonBySlug(params.slug);

  if (!addon) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto py-16 px-6">
        {/* Header */}
        <div className="text-center mb-12 border-b border-muted pb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">
            {addon.name}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            {addon.tagline}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            {/* Overview */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">What It Is</h2>
              <p className="text-muted-foreground leading-relaxed">
                {addon.overview}
              </p>
            </section>

            {/* Use Case */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Example Use Case</h2>
              <div className="bg-muted/50 p-6 rounded-lg border">
                <h4 className="font-semibold text-primary mb-2">
                  {addon.useCase.title}
                </h4>
                <p className="text-muted-foreground">
                  {addon.useCase.content}
                </p>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1 space-y-8">
            {/* Key Benefits */}
            <section className="bg-muted/50 p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">Key Benefits</h3>
              <ul className="space-y-3">
                {addon.keyBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <Check
                      className="w-5 h-5 text-green-500 mt-1 flex-shrink-0"
                    />
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* CTA Card */}
            <section className="bg-primary/5 p-6 rounded-lg border border-primary sticky top-24">
              <h3 className="text-xl font-semibold mb-4">Get This Add-On</h3>
              <Link href="/pricing">
                <a className="w-full block text-center bg-primary text-primary-foreground rounded-lg py-3 font-semibold hover:bg-primary/90 transition">
                  Add to Plan <ArrowRight className="inline w-4 h-4 ml-1" />
                </a>
              </Link>
              <p className="text-xs text-center text-muted-foreground mt-2">
                You can select your plan and add-ons on the pricing page.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
'''