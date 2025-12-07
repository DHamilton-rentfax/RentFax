"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import AnnouncementBar from "@/components/marketing/AnnouncementBar";

const NAV_ITEMS = [
  { name: "Home", href: "/" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "Pricing", href: "/pricing" },
  { name: "Blog", href: "/blog" },
  { name: "Demo", href: "/demo", special: true },
  { name: "Contact", href: "/contact" },
];

export default function MarketingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-[70]">
      {/* ANNOUNCEMENT BAR – lives INSIDE header now */}
      <AnnouncementBar />

      {/* MAIN NAV WRAPPER */}
      <div
        className={clsx(
          "bg-white/80 backdrop-blur-xl border-b border-gray-200/70 transition-all",
          scrollY > 4 ? "shadow-sm" : "shadow-none"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-extrabold text-[#1A2540]">
            Rent<span className="text-[#D4AF37]">FAX</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 font-medium">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "relative transition-colors text-gray-700 hover:text-[#1A2540]",
                    item.special && "text-[#D4AF37] font-semibold"
                  )}
                >
                  {item.name}
                  {active && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute left-0 -bottom-1 h-[2px] w-full bg-[#D4AF37] rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg font-medium transition text-[#1A2540] border border-gray-300 hover:bg-gray-100"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2 rounded-lg bg-[#D4AF37] text-[#1A2540] font-semibold hover:bg-[#e8c557]"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden transition text-[#1A2540]"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.23 }}
            className="lg:hidden bg-white border-b border-gray-200 shadow-xl"
          >
            <nav className="flex flex-col px-6 py-4 gap-4 text-[#1A2540] font-medium">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={clsx(
                    item.special ? "text-[#D4AF37]" : "hover:text-black",
                    "block py-2"
                  )}
                >
                  {item.name}
                </Link>
              ))}

              <div className="border-t border-gray-200 my-3" />

              <Link
                href="/login"
                className="py-2 border border-gray-300 rounded-md text-center hover:bg-gray-100"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="py-2 bg-[#D4AF37] text-[#1A2540] rounded-md text-center font-semibold hover:bg-[#e8c557]"
              >
                Get Started
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
