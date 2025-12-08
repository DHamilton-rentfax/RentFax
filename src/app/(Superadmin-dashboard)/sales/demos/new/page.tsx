"use client";

import { DemoScheduler } from "@/components/sales/DemoScheduler";

export default function NewDemoPage() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold">Schedule Demo</h1>
      <DemoScheduler />
    </div>
  );
}
