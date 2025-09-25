
'use client';

import { Button } from '@/components/ui/button';
import { Plan, Addon } from '@/lib/pricing-data';
import { X, ShoppingCart } from 'lucide-react';

interface PricingCartProps {
  selectedPlan: Plan;
  selectedAddons: Addon[];
  isAnnual: boolean;
}

export default function PricingCart({
  selectedPlan,
  selectedAddons,
  isAnnual,
}: PricingCartProps) {
  const planPrice = isAnnual ? selectedPlan.priceAnnualNum : selectedPlan.priceMonthlyNum;
  const addonsPrice = selectedAddons.reduce(
    (total, addon) => total + (isAnnual ? addon.priceAnnual : addon.priceMonthly),
    0
  );
  const totalPrice = planPrice + addonsPrice;

  return (
    <div className="sticky bottom-0 z-50 w-full bg-card border-t shadow-lg p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="hidden sm:block">
            <h3 className="font-semibold text-lg">Your Plan</h3>
            <p className="text-sm text-muted-foreground">
              {selectedPlan.name} Plan
            </p>
          </div>
          <div className="hidden md:block">
            <h4 className="font-semibold text-lg">
              {selectedAddons.length} Add-on
              {selectedAddons.length !== 1 ? 's' : ''}
            </h4>
            <ul className="text-sm text-muted-foreground list-disc pl-5">
              {selectedAddons.slice(0, 2).map((addon) => (
                <li key={addon.id}>{addon.name}</li>
              ))}
              {selectedAddons.length > 2 && <li>and more...</li>}
            </ul>
          </div>
        </div>
        <div className="flex items-center gap-4">
            <div>
                 <p className="text-2xl font-bold text-right">
                    ${totalPrice.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground text-right">per {isAnnual ? 'year' : 'month'}</p>
            </div>
          <Button size="lg" className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
