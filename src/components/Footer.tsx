'use client';

import Link from "next/link";
import { Building2 } from "lucide-react";

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

export default function Footer() {
  return (
    <footer className='bg-white border-t border-gray-200 mt-12'>
      <div className='container mx-auto py-12 px-4'>
        <div className="xl:grid xl:grid-cols-5 xl:gap-8">
          
          {/* Brand Column */}
          <div className="space-y-4 xl:col-span-1">
            <div className='flex items-center gap-2'>
              <Building2 className='h-6 w-6 text-primary' />
              <span className='font-headline text-xl font-bold text-black'>
                RentFAX
              </span>
            </div>
            <p className='text-sm text-gray-600'>
              Smarter Risk. Safer Rentals.
            </p>
          </div>

          {/* Link Columns */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-4 md:grid-cols-4">
            
            {/* Product */}
            <FooterColumn title="Product" links={footerLinks.product} />

            {/* Company */}
            <FooterColumn title="Company" links={footerLinks.company} />

            {/* Stakeholders */}
            <FooterColumn title="Stakeholders" links={footerLinks.stakeholders} />

            {/* Legal */}
            <FooterColumn title="Legal" links={footerLinks.legal} />

          </div>
        </div>

        {/* Bottom Bar */}
        <div className='mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-sm text-gray-600'>
            &copy; {new Date().getFullYear()} RentFAX, Inc. All rights reserved.
          </p>
          <ChatNowButton />
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">{title}</h3>
      <ul className="mt-4 space-y-4">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className={`text-base ${link.special ? 'font-bold text-blue-600' : 'text-gray-600'} hover:text-black`}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
