'use client';

import Link from "next/link";
import { Building2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import ChatNowButton from "./ChatNowButton";

const footerLinks = {
  product: [
    { name: "Pricing", href: "/pricing" },
    { name: "How it Works", href: "/how-it-works" },
    { name: "Demo", href: "/demo", special: true },
    { name: "Success Stories", href: "/success-stories" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
    { name: "Press & Media Kit", href: "/press" },
    { name: "Partner Program", href: "/partners" },
  ],
  stakeholders: [
    { name: "For Landlords", href: "/landlords" },
    { name: "For Renters", href: "/renters" },
    { name: "For Agencies", href: "/agencies" },
    { name: "API & Developers", href: "/developers" },
    { name: "Integration Partners", href: "/integrations" },
  ],
  legal: [
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Legal Partner Agreement", href: "/legal/partners" },
    { name: "Collection Agency Agreement", href: "/legal/collections" },
    { name: "API & Integration Agreement", href: "/legal/api" },
    { name: "Data Rights & Deletion", href: "/legal/data-deletion" },
    { name: "DMCA", href: "/legal/dmca" },
    { name: "Cookie Policy", href: "/legal/cookies" },
    { name: "Security Practices", href: "/security" },
    { name: "Responsible Disclosure", href: "/security/disclosure" },
    { name: "Accessibility", href: "/accessibility" },
    { name: "AI Transparency", href: "/ai-transparency" },
    { name: "Protect by RentFAX", href: "/protect", special: true },
  ],
};

// mobile collapsible section
function FooterSection({ title, links }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:space-y-4">
      {/* MOBILE HEADER */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex md:hidden items-center justify-between py-3 border-b border-gray-200 text-left"
      >
        <span className="text-sm font-semibold text-gray-900 tracking-wide uppercase">
          {title}
        </span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {/* MOBILE CONTENT */}
      <ul
        className={`${open ? "block" : "hidden"} md:block mt-4 space-y-4`}
      >
        {links.map((link: any) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className={`text-sm ${
                link.special ? "font-bold text-blue-600" : "text-gray-600"
              } hover:text-black`}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="container mx-auto py-12 px-4">

        {/* TOP GRID */}
        <div className="xl:grid xl:grid-cols-5 xl:gap-8">
          {/* LOGO + TAGLINE */}
          <div className="space-y-4 xl:col-span-1">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="font-headline text-xl font-bold text-black">
                RentFAX
              </span>
            </div>
            <p className="text-sm text-gray-600 max-w-xs">
              Smarter Risk. Safer Rentals.  
              Identity, fraud, and incident intelligence for rental businesses.
            </p>
          </div>

          {/* LINK GRID */}
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-4 xl:mt-0 xl:col-span-4">

            <FooterSection title="Product" links={footerLinks.product} />
            <FooterSection title="Company" links={footerLinks.company} />
            <FooterSection title="Stakeholders" links={footerLinks.stakeholders} />
            <FooterSection title="Legal" links={footerLinks.legal} />

          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} RentFAX, Inc. All rights reserved.
          </p>

          {/* AI chat / support CTA */}
          <ChatNowButton />
        </div>
      </div>
    </footer>
  );
}
