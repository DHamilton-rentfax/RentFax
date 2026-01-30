"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Search, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const NAV_ITEMS = [
  { name: "Home", href: "/" },
  {
    name: "Solutions",
    items: [
      { name: "Landlords", href: "/landlords", description: "For property owners and managers" },
      { name: "Enterprise", href: "/enterprise", description: "For large-scale rental operations" },
    ],
  },
  { name: "Pricing", href: "/pricing" },
  {
    name: "Resources",
    items: [
      { name: "How It Works", href: "/how-it-works", description: "Learn about our AI-powered platform" },
      { name: "Agencies", href: "/agencies", description: "Partner with us for collections" },
      { name: "Investors", href: "/investors", description: "Invest in the future of rental intelligence" },
      { name: "Blog", href: "/blog", description: "Latest news and insights" },
      { name: "Contact", href: "/contact", description: "Get in touch with our team" },
    ],
  },
];

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    posthog?: {
      capture: (event_name: string, properties?: any) => void;
    };
  }
}

function NavItem({ item, pathname }: { item: any, pathname: string | null }) {
  const [isHovered, setIsHovered] = useState(false);
  const hasSubmenu = item.items && item.items.length > 0;
  const isActive = hasSubmenu ? item.items.some((subItem:any) => subItem.href === pathname) : pathname === item.href;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={item.href || '#'}
        className={clsx(
          "flex items-center gap-1 relative transition-colors hover:text-[#1A2540]",
          isActive ? "text-[#1A2540]" : "text-gray-700"
        )}
      >
        {item.name}
        {hasSubmenu && <ChevronDown className="h-4 w-4" />}
      </Link>
      {isActive && !hasSubmenu && (
        <motion.div
          layoutId="nav-underline"
          className="absolute left-0 -bottom-1 h-[2px] w-full bg-[#D4AF37]"
        />
      )}
      <AnimatePresence>
        {hasSubmenu && isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg"
          >
            <div className="p-2">
              {item.items.map((subItem: any) => (
                <Link
                  key={subItem.href}
                  href={subItem.href}
                  className="block px-4 py-2 rounded-md hover:bg-gray-100"
                >
                  <p className="font-semibold text-gray-900">{subItem.name}</p>
                  <p className="text-sm text-gray-500">{subItem.description}</p>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MarketingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const pathname = usePathname();

  const startScreening = (location: string) => {
    window.gtag?.("event", "start_screening_click", {
      source: "marketing_site",
      location,
    });

    window.posthog?.capture("start_screening_click", {
      source: "marketing_site",
      location,
    });

    window.location.href =
      "https://app.rentfax.io/search?source=website";
  };

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-[70]">
      <div
        className={clsx(
          "bg-white/90 backdrop-blur-xl border-b transition-all",
          scrollY > 4 ? "shadow-sm border-gray-200" : "border-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-extrabold text-[#1A2540]">
            Rent<span className="text-[#D4AF37]">FAX</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 font-medium">
            {NAV_ITEMS.map((item) => (
              <NavItem key={item.name} item={item} pathname={pathname} />
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="https://app.rentfax.io/login"
              className="px-4 py-2 rounded-md text-sm font-semibold border border-gray-300 text-[#1A2540] hover:bg-gray-100"
            >
              Log In
            </Link>

            <button
              onClick={() => startScreening('header')}
              className="flex items-center gap-2 px-5 py-2 rounded-md bg-[#1A2540] text-white text-sm font-semibold hover:bg-[#11182c]"
            >
              <Search className="h-4 w-4" />
              Start Screening
            </button>
          </div>

          <button
            className="lg:hidden text-[#1A2540]"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-b shadow-lg"
          >
            <nav className="flex flex-col px-6 py-4 gap-4 text-[#1A2540] font-medium">
              {NAV_ITEMS.map((item) => (
                item.href ? (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="py-2"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <div key={item.name}>
                    <p className="py-2 font-semibold">{item.name}</p>
                    {item.items?.map((subItem:any) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        onClick={() => setMobileOpen(false)}
                        className="py-2 pl-4 block"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )
              ))}

              <div className="border-t my-2" />

              <Link
                href="https://app.rentfax.io/login"
                className="py-2 border rounded-md text-center"
                onClick={() => setMobileOpen(false)}
              >
                Log In
              </Link>

              <button
                onClick={() => startScreening('header')}
                className="py-2 rounded-md bg-[#1A2540] text-white font-semibold"
              >
                Start Screening
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
