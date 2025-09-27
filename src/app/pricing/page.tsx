
"use client";

import { useState } from "react";
import { Check, Info, MessageCircle, ShoppingCart, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { plans, addons, Plan, Addon } from "@/lib/pricing-data";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { auth } from '@/lib/firebase';


export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly"
  );
  const [selectedPlan, setSelectedPlan] = useState<string | null>("plan_pro");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [showPaygModal, setShowPaygModal] = useState(false);
  const [showSalesModal, setShowSalesModal] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const total = () => {
    let planPrice = 0;
    if (selectedPlan && selectedPlan !== "plan_payg" && selectedPlan !== "plan_enterprise") {
      const plan = plans.find((p) => p.id === selectedPlan);
      if (plan) {
        planPrice = billingCycle === 'monthly' ? plan.priceMonthlyNum : plan.priceAnnualNum;
      }
    }
    const addonsTotal = selectedAddons.reduce((sum, addonId) => {
      const addon = addons.find((a) => a.id === addonId);
      if (!addon) return sum;
      return sum + (billingCycle === 'monthly' ? addon.priceMonthly : addon.priceAnnual);
    }, 0);

    return planPrice + addonsTotal;
  };
  
  const handleCheckout = async () => {
    if (!selectedPlan && selectedAddons.length === 0) {
      alert("Please select a plan or add-on before checkout.");
      return;
    }
    setIsCheckingOut(true);
    try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) {
            alert("Please log in to complete your purchase.");
            setIsCheckingOut(false);
            return;
        }

        const res = await fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                planId: selectedPlan,
                addons: selectedAddons,
                billingCycle,
            }),
        });

        const data = await res.json();
        if (data.url) {
            window.location.href = data.url;
        } else {
            alert("Checkout error: " + data.error);
        }
    } catch(e: any) {
        alert("An unexpected error occurred: " + e.message);
    } finally {
        setIsCheckingOut(false);
    }
    
  };

  const handlePayAsYouGoCheckout = async () => {
    setIsCheckingOut(true);
    try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) {
            alert("Please log in to complete your purchase.");
            setIsCheckingOut(false);
            return;
        }
        const res = await fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ mode: "payg" }),
        });
        const data = await res.json();
        if (data.url) {
            window.location.href = data.url;
        } else {
            alert("Checkout error: " + data.error);
        }
    } catch(e: any) {
        alert("An unexpected error occurred: " + e.message);
    } finally {
        setIsCheckingOut(false);
    }
  }


  const handlePlanSelect = (planId: string) => {
    if (planId === 'plan_enterprise') {
        setShowSalesModal(true);
        return;
    }
    if (planId === 'plan_payg') {
        setShowPaygModal(true);
        return;
    }
    setSelectedPlan(current => current === planId ? null : planId);
  }

  const groupedAddons = addons.reduce(
    (acc: Record<string, Addon[]>, addon) => {
      if (!acc[addon.category]) acc[addon.category] = [];
      acc[addon.category].push(addon);
      return acc;
    },
    {}
  );
  

  return (
    <div className="bg-background text-foreground pb-40">
      {/* Hero */}
      <section className="text-center py-16 border-b">
        <h1 className="text-4xl font-bold mb-4 font-headline">
          Pricing Built for Rentals
        </h1>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Choose a plan and enhance it with powerful add-ons. Scale as your
          portfolio grows.
        </p>
        <div className="inline-flex items-center space-x-1 rounded-full bg-muted p-1">
          <Button
            onClick={() => setBillingCycle("monthly")}
            variant={billingCycle === "monthly" ? "default" : "ghost"}
            size="sm"
            className="rounded-full px-6"
          >
            Monthly
          </Button>
          <Button
            onClick={() => setBillingCycle("annual")}
            variant={billingCycle === "annual" ? "default" : "ghost"}
            size="sm"
            className="rounded-full px-6"
          >
            Annual (Save 15%)
          </Button>
        </div>
      </section>

      {/* Plans */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-16 px-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative flex flex-col rounded-xl border p-6 shadow-sm transition-all h-full ${
              selectedPlan === plan.id
                ? "border-primary ring-2 ring-primary/50"
                : "border-border"
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 text-xs rounded-full font-semibold">
                Most Popular
              </div>
            )}
            <div className="flex-grow">
              <h3 className="text-xl font-bold mb-2 font-headline">
                {plan.name}
              </h3>
              <p className="text-3xl font-extrabold mb-4">
                {typeof plan.priceMonthlyNum === "number" && plan.priceMonthlyNum > 0
                  ? `$${billingCycle === "monthly" ? plan.priceMonthlyNum : plan.priceAnnualNum}`
                  : plan.priceMonthly}
                <span className="text-sm font-normal text-muted-foreground">
                  {typeof plan.priceMonthlyNum === 'number' && plan.priceMonthlyNum > 0 ? (billingCycle === "monthly" ? "/mo" : "/yr") : ''}
                </span>
              </p>
              <p className="text-muted-foreground text-sm h-12">
                {plan.description}
              </p>
              <ul className="space-y-3 text-sm my-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button
              onClick={() => handlePlanSelect(plan.id)}
              variant={selectedPlan === plan.id ? "destructive" : "default"}
              className="w-full"
              size="lg"
            >
              {plan.id === 'plan_enterprise' ? 'Contact Sales' : (selectedPlan === plan.id ? "Selected" : "Select Plan")}
            </Button>
          </div>
        ))}
      </section>

      {/* Add-Ons */}
      <section className="max-w-7xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold mb-8 text-center font-headline">
          Customize with Add-ons
        </h2>
        {Object.entries(groupedAddons).map(([category, items]) => (
          <div key={category} className="mb-12">
            <h3 className="text-xl font-semibold mb-4">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((addon) => {
                const isSelected = selectedAddons.includes(addon.id);
                return (
                  <div
                    key={addon.id}
                    className={`relative flex flex-col justify-between p-5 border rounded-xl shadow-sm h-full transition-all ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/50"
                        : "border-border"
                    }`}
                  >
                     {addon.popular && (
                        <div className="absolute top-2 right-2 text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded font-semibold">Popular</div>
                    )}
                    <div>
                      <div className="flex items-start justify-between">
                         <h4 className="font-semibold pr-4">{addon.name}</h4>
                        <Popover>
                          <PopoverTrigger>
                            <Info className="w-4 h-4 text-muted-foreground cursor-pointer shrink-0" />
                          </PopoverTrigger>
                          <PopoverContent className="text-sm">
                            {addon.description}
                          </PopoverContent>
                        </Popover>
                      </div>
                       <p className="text-sm text-muted-foreground mt-1 mb-3">{addon.short}</p>
                    </div>
                    <div className="flex items-center justify-between">
                       <p className="text-lg font-bold">
                        $
                        {billingCycle === "monthly"
                          ? addon.priceMonthly
                          : addon.priceAnnual}
                         <span className="text-sm font-normal text-muted-foreground">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                      </p>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={addon.id} className="text-sm font-medium cursor-pointer">
                           {isSelected ? "Remove" : "Add"}
                        </Label>
                        <Switch
                            id={addon.id}
                            checked={isSelected}
                            onCheckedChange={() => toggleAddon(addon.id)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold mb-6 text-center font-headline">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="q1">
            <AccordionTrigger>How does RentFAX work?</AccordionTrigger>
            <AccordionContent>
              RentFAX pulls renter data, applies fraud checks, and generates a
              risk score + report. Reports are available instantly in your
              dashboard.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>What if I exceed my reports?</AccordionTrigger>
            <AccordionContent>
              You can purchase additional reports Pay-As-You-Go, or upgrade to
              Unlimited for flat monthly pricing.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger>Can I cancel anytime?</AccordionTrigger>
            <AccordionContent>
              Yes, you can cancel or switch plans at any time directly in your
              dashboard.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Sticky Cart */}
       {(selectedPlan && selectedPlan !== 'plan_payg' && selectedPlan !== 'plan_enterprise' || selectedAddons.length > 0) && (
        <div className="fixed bottom-0 inset-x-0 bg-card/95 backdrop-blur-sm border-t shadow-lg p-4 z-50">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex-grow">
                <h4 className="font-semibold flex items-center gap-2"><ShoppingCart /> Your Cart</h4>
                <ul className="text-sm text-muted-foreground list-disc pl-5 mt-1">
                 {selectedPlan && selectedPlan !== 'plan_payg' && selectedPlan !== 'plan_enterprise' && (
                    <li>
                        {plans.find(p => p.id === selectedPlan)?.name} Plan
                    </li>
                 )}
                {selectedAddons.map((id) => {
                    const addon = addons.find((a) => a.id === id)!;
                    return <li key={id}>{addon.name}</li>;
                })}
                </ul>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="font-bold text-lg">Total: ${total().toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">per {billingCycle === 'monthly' ? 'month' : 'year'}</p>
                </div>
                <Button size="lg" onClick={handleCheckout} disabled={isCheckingOut}>
                    {isCheckingOut && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Checkout
                </Button>
            </div>
            </div>
        </div>
      )}

      {/* Chat Widget */}
      <button className="fixed bottom-24 right-6 bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:bg-primary/90 z-50">
        <MessageCircle className="w-6 h-6" />
      </button>

        {/* Pay-As-You-Go Modal */}
      {showPaygModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button onClick={() => setShowPaygModal(false)} className="absolute top-2 right-2 text-gray-500">
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">Buy 1 Report</h2>
            <p className="mb-4 text-gray-600">Pay-as-you-go reports cost <strong>$20 each</strong>. No subscription required.</p>
            <Button onClick={handlePayAsYouGoCheckout} className="w-full" disabled={isCheckingOut}>
              {isCheckingOut && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Checkout – $20
            </Button>
          </div>
        </div>
      )}

      {/* Enterprise Contact Modal */}
      {showSalesModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button onClick={() => setShowSalesModal(false)} className="absolute top-2 right-2 text-gray-500">
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">Contact Sales</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // TODO: call API to save to Firestore + SendGrid email
                alert("✅ Request sent to Sales");
                setShowSalesModal(false);
              }}
              className="space-y-4"
            >
              <input type="text" placeholder="Your Name" required className="w-full border rounded p-2" />
              <input type="email" placeholder="Your Email" required className="w-full border rounded p-2" />
              <textarea placeholder="Message" required className="w-full border rounded p-2" rows={4}></textarea>
              <Button type="submit" className="w-full" disabled={isCheckingOut}>
                Send Request
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
