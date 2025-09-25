
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Check,
  Zap,
  FolderSync,
  Users,
  ShieldCheck,
  DollarSign,
  MessageSquare,
  Info,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { plans, addons, Addon, Plan } from '@/lib/pricing-data';
import PricingCart from './pricing-cart';

const categoryIcons: { [key: string]: React.ReactNode } = {
  'Risk & AI': <Zap className="h-5 w-5" />,
  'Data & Uploads': <FolderSync className="h-5 w-5" />,
  'Team & Access': <Users className="h-5 w-5" />,
  Compliance: <ShieldCheck className="h-5 w-5" />,
  'Collections & Financial': <DollarSign className="h-5 w-5" />,
  Communication: <MessageSquare className="h-5 w-5" />,
};

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan>(plans[1]); // Default to Pro
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);

  const toggleAddon = (addon: Addon) => {
    setSelectedAddons((prev) =>
      prev.some((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const groupedAddons = addons.reduce((acc, addon) => {
    (acc[addon.category] = acc[addon.category] || []).push(addon);
    return acc;
  }, {} as Record<string, Addon[]>);

  return (
    <main className="bg-background text-foreground">
      <section className="py-16 text-center">
        <h1 className="font-headline text-4xl font-bold">
          Simple, Transparent Pricing
        </h1>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Choose a plan that fits your rental business. Start small or scale to
          enterprise — RentFAX grows with you.
        </p>
        <div className="mt-8 inline-flex items-center gap-3 bg-card border rounded-lg shadow-sm p-2">
          <button
            onClick={() => setIsAnnual(false)}
            className={cn(
              'px-4 py-1.5 rounded-md text-sm font-medium transition-colors',
              !isAnnual
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={cn(
              'px-4 py-1.5 rounded-md text-sm font-medium transition-colors',
              isAnnual
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            )}
          >
            Annual (Save 10%)
          </button>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-6 grid gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              'p-8 border rounded-2xl shadow-sm bg-card hover:shadow-lg transition-shadow flex flex-col',
              selectedPlan.id === plan.id ? 'border-primary ring-2 ring-primary' : ''
            )}
            onClick={() => setSelectedPlan(plan)}
          >
            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <p className="mt-2 text-2xl font-bold">
              {isAnnual ? plan.priceAnnual : plan.priceMonthly}
            </p>
            <p className="mt-2 text-muted-foreground h-12">{plan.description}</p>
            <ul className="mt-6 space-y-3 text-sm text-foreground flex-grow">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-primary" /> {f}
                </li>
              ))}
            </ul>
            <Button
              variant={selectedPlan.id === plan.id ? 'default' : 'outline'}
              className="mt-8 w-full"
              size="lg"
            >
              {selectedPlan.id === plan.id ? 'Selected' : 'Select Plan'}
            </Button>
          </div>
        ))}
      </section>

      <section className="pb-16 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-headline">
              Or Start With a Free Report
            </h2>
            <p className="text-muted-foreground mt-2">
              Not ready to commit? Screen one renter for free, on us.
            </p>
        </div>
        <Card className="max-w-2xl mx-auto bg-muted/50">
            <CardHeader>
                <CardTitle>Free Renter Report</CardTitle>
                <CardDescription>Get 1 free renter risk report — no credit card required.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild variant="secondary">
                    <Link href="/screen">Try Free Report</Link>
                </Button>
            </CardContent>
        </Card>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-headline">
              Customize with Add-Ons
            </h2>
            <p className="text-muted-foreground mt-2">
              Tailor your plan with powerful features to match your workflow.
            </p>
          </div>
          
          <div className="space-y-12">
            {Object.entries(groupedAddons).map(([category, addonsInCategory]) => (
              <div key={category}>
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                  {categoryIcons[category]}
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {addonsInCategory.map((addon) => (
                    <Card key={addon.id} className="flex flex-col relative overflow-hidden">
                      {addon.popular && (
                            <div className="absolute top-2 right-[-28px] bg-accent text-accent-foreground px-6 py-1 text-xs font-bold rotate-45">
                                Popular
                            </div>
                        )}
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span>{addon.name}</span>
                           <Switch
                            id={addon.id}
                            checked={selectedAddons.some((a) => a.id === addon.id)}
                            onCheckedChange={() => toggleAddon(addon)}
                          />
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1 pt-2">
                            <span>
                                {addon.description}
                            </span>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Info className="h-4 w-4 cursor-pointer shrink-0 text-muted-foreground hover:text-foreground" />
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <p className="text-sm">{addon.description}</p>
                                </PopoverContent>
                            </Popover>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow flex items-end justify-between">
                        <div className="text-right ml-auto">
                          <p className="font-semibold text-base">
                            +
                            {isAnnual
                              ? `$${addon.priceAnnual}/yr`
                              : `$${addon.priceMonthly}/mo`}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PricingCart
        selectedPlan={selectedPlan}
        selectedAddons={selectedAddons}
        isAnnual={isAnnual}
      />
    </main>
  );
}
