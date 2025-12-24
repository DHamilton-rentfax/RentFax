'use client';

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics"; // Assuming you have an analytics helper

export default function HelpCTA({ cta, articleSlug }: { cta: any; articleSlug: string }) {
  const { user, role, plan } = useAuth();

  useEffect(() => {
    if (cta) {
        // In a real app, you would use a proper analytics service
        // and handle potential errors.
        console.log("Tracking CTA View", { articleSlug, ctaType: cta.type });
        // trackEvent('HELP_CTA_VIEW', { articleSlug, ctaType: cta.type });
    }
  }, [cta, articleSlug]);

  if (!cta) return null;

  // Role-based visibility
  if (cta.roles && (!role || !cta.roles.includes(role))) {
    // Special case: if a logged-out user sees a CTA that requires a role, show a signup/login prompt instead.
    if (!user) {
        return (
            <div className="mt-12 p-6 border rounded-xl bg-gray-50 text-center">
                <p className="font-medium">You need an account to {cta.label.toLowerCase()}</p>
                <Link href={`/login?redirect=/help/article/${articleSlug}`}>
                    <span className="inline-block mt-2 px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700">
                        Login or Sign Up
                    </span>
                </Link>
            </div>
        );
    }
    return null;
  }

  // Plan-based visibility (soft-gate)
  if (cta.plans && (!plan || !cta.plans.includes(plan))) {
     return (
        <div className="mt-12 p-6 border rounded-xl bg-yellow-50 text-center">
             <p className="font-medium">This action is available on our premium plans.</p>
             <Link href="/pricing">
                 <span className="inline-block mt-2 px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700">
                     Upgrade Your Plan
                 </span>
            </Link>
        </div>
    );
  }

  const handleClick = () => {
      console.log("Tracking CTA Click", { articleSlug, ctaType: cta.type });
    // trackEvent('HELP_CTA_CLICK', { articleSlug, ctaType: cta.type });
  };

  return (
    <div className="mt-12 p-6 border rounded-xl bg-blue-50 text-center">
      <Link
        href={cta.href}
        onClick={handleClick}
        className={`inline-block px-8 py-3 rounded-lg text-lg font-semibold text-white ${
          cta.style === "secondary" ? "bg-gray-700 hover:bg-gray-800" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {cta.label}
      </Link>
    </div>
  );
}
