"use client";

import { Lock, Sparkles, QrCode, ShieldAlert, Headphones } from "lucide-react";
import clsx from "clsx";

import { useAuth } from "@/hooks/use-auth";
import { ADDONS } from "@/config/addons";

const ICONS: any = { Sparkles, QrCode, ShieldAlert, Headphones };

export default function AddOnsPage() {
  const { company } = useAuth();
  const plan = company?.plan || "free";
  const addons = company?.addons || {};

  const plans = ["free", "starter", "pro", "enterprise"];
  const planRank = (p: string) => plans.indexOf(p);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Available Add-Ons</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ADDONS.map((addon) => {
          const Icon = ICONS[addon.icon];
          const unlocked = addons[addon.key];
          const meetsPlan = planRank(plan) >= planRank(addon.requiredPlan);
          const locked = !unlocked && !meetsPlan;

          return (
            <div
              key={addon.key}
              className={clsx(
                "rounded-2xl p-5 border shadow-sm relative transition",
                locked ? "bg-gray-100 opacity-60" : "bg-white hover:shadow-lg"
              )}
            >
              <div className="flex items-center gap-3 mb-3">
                <Icon className={clsx("w-6 h-6", locked ? "text-gray-400" : "text-blue-600")} />
                <h2 className="font-semibold text-lg text-gray-800">{addon.name}</h2>
              </div>

              <p className="text-sm text-gray-600 mb-4">{addon.description}</p>

              {locked ? (
                <button
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 text-white rounded-2xl hover:bg-black/40"
                  onClick={() => alert(`Upgrade to ${addon.requiredPlan.toUpperCase()} plan to unlock ${addon.name}`)}
                >
                  <Lock className="mb-2" /> <span>Upgrade to Unlock</span>
                </button>
              ) : (
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                  {unlocked ? "Enabled" : "Activate"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}