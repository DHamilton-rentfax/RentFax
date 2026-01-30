"use client";

import Link from "next/link";
import { Building2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const footerLinks = {
  solutions: [
    { name: "Landlords", href: "/landlords" },
    { name: "Enterprise", href: "/enterprise" },
  ],
  resources: [
    { name: "How It Works", href: "/how-it-works" },
    { name: "Agencies", href: "/agencies" },
    { name: "Investors", href: "/investors" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Pricing", href: "/pricing" },
  ],
  legal: [
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Data Protection", href: "/data-protection" },
  ],
};

function FooterSection({
  title,
  links,
}: {
  title: string;
  links: { name: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:space-y-4">
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex md:hidden items-center justify-between py-3 border-b border-gray-200 text-left"
      >
        <span className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          {title}
        </span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {/* Links */}
      <ul className={`${open ? "block" : "hidden"} md:block mt-4 space-y-4`}>
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="text-sm text-gray-600 hover:text-black"
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
      <div className="max-w-7xl mx-auto py-12 px-4">

        {/* Top grid */}
        <div className="xl:grid xl:grid-cols-5 xl:gap-8">
          {/* Brand */}
          <div className="space-y-4 xl:col-span-1">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-[#1A2540]" />
              <span className="text-xl font-bold text-[#1A2540]">
                Rent<span className="text-[#D4AF37]">FAX</span>
              </span>
            </div>

            <p className="text-sm text-gray-600 max-w-xs">
              Smarter risk. Safer rentals.
              <br />
              Identity, fraud, and incident intelligence for rental businesses.
            </p>
          </div>

          {/* Links */}
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-4 xl:mt-0 xl:col-span-4">
            <FooterSection title="Solutions" links={footerLinks.solutions} />
            <FooterSection title="Resources" links={footerLinks.resources} />
            <FooterSection title="Company" links={footerLinks.company} />
            <FooterSection title="Legal" links={footerLinks.legal} />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} RentFAX, Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="/sitemap.xml"
              className="text-sm text-gray-500 hover:underline"
            >
              Sitemap
            </Link>

            <a
              href="/contact"
              className="text-sm font-semibold text-[#1A2540] hover:underline"
            >
              Talk to Sales
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
