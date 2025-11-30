'use client';

import { use, useState } from "react";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const addOnGroups = [
    {
      title: "Fraud & Risk Tools",
      items: [
        { name: "AI Dispute Draft Assistant", price: 29, slug: "ai-dispute-draft-assistant" },
        { name: "Advanced AI Risk Reports", price: 49, slug: "advanced-ai-risk-reports" },
        { name: "Branded Tenant Reports", price: 19, slug: "branded-tenant-reports" },
        { name: "Smart Monitoring", price: 49, slug: "smart-monitoring" },
      ],
    },
    {
      title: "Analytics & Insights",
      items: [
        { name: "Insights+ Add-On", price: 29, slug: "insights-plus" },
        { name: "Portfolio Insights Dashboard", price: 99, slug: "portfolio-insights-dashboard" },
        { name: "Data Enrichment", price: 79, slug: "data-enrichment" },
      ],
    },
];

export default function AddOnCartSidebar({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
    const [selectedAddOns, setSelectedAddOns] = useState<any[]>([]);

    const toggleAddOn = (addon: any) => {
        setSelectedAddOns((prev) =>
            prev.some((a) => a.slug === addon.slug)
                ? prev.filter((a) => a.slug !== addon.slug)
                : [...prev, addon]
        );
    };

    const totalPrice = selectedAddOns.reduce((acc, addon) => acc + addon.price, 0);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>Manage Add-Ons</SheetTitle>
                    <SheetDescription>
                        Customize your RentFAX plan with powerful new features.
                    </SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-6">
                    {addOnGroups.map(group => (
                        <div key={group.title}>
                            <h4 className="text-lg font-semibold mb-2">{group.title}</h4>
                            <div className="space-y-2">
                                {group.items.map(addon => {
                                    const isSelected = selectedAddOns.some(a => a.slug === addon.slug);
                                    return (
                                        <div key={addon.slug} className="flex justify-between items-center p-3 border rounded-lg">
                                            <div>
                                                <p className="font-medium">{addon.name}</p>
                                                <p className="text-sm text-muted-foreground">${addon.price}/mo</p>
                                            </div>
                                            <Button variant={isSelected ? "outline" : "default"} size="sm" onClick={() => toggleAddOn(addon)}>
                                                {isSelected ? "Remove" : "Add"}
                                            </Button>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                <SheetFooter>
                    <div className="w-full space-y-2">
                        <Separator />
                        <div className="flex justify-between font-semibold">
                            <span>Monthly Total</span>
                            <span>${totalPrice}/mo</span>
                        </div>
                        <Button className="w-full">Update Subscription</Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
