'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import AnnouncementBar from "@/components/marketing/AnnouncementBar";
import { useModal } from "@/contexts/ModalContext";

const NAV_ITEMS = [
  { name: "Home", href: "/" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "Pricing", href: "/pricing" },
  { name: "Partners", href: "/partners" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export default function MarketingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const pathname = usePathname();
  const { open } = useModal();

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-[70]">
      {/* Announcement */}
      <AnnouncementBar />

      {/* Main Nav */}
      <div
        className={clsx(
          "bg-white/90 backdrop-blur-xl border-b transition-all",
          scrollY > 4 ? "shadow-sm border-gray-200" : "border-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-extrabold text-[#1A2540]">
            Rent<span className="text-[#D4AF37]">FAX</span>
          </Link>

          {/* Desktop / Tablet Nav */}
          <nav className="hidden lg:flex items-center gap-6 font-medium">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "relative transition-colors hover:text-[#1A2540]",
                    active ? "text-[#1A2540]" : "text-gray-700"
                  )}
                >
                  {item.name}
                  {active && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute left-0 -bottom-1 h-[2px] w-full bg-[#D4AF37]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-md text-sm font-semibold border border-gray-300 text-[#1A2540] hover:bg-gray-100"
            >
              Log In
            </Link>

            <button
              onClick={() => open("searchRenter")}
              className="flex items-center gap-2 px-5 py-2 rounded-md bg-[#1A2540] text-white text-sm font-semibold hover:bg-[#11182c]"
            >
              <Search className="h-4 w-4" />
              Start Screening
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden text-[#1A2540]"
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
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-b shadow-lg"
          >
            <nav className="flex flex-col px-6 py-4 gap-4 text-[#1A2540] font-medium">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-2"
                >
                  {item.name}
                </Link>
              ))}

              <div className="border-t my-2" />

              <Link
                href="/login"
                className="py-2 border rounded-md text-center"
                onClick={() => setMobileOpen(false)}
              >
                Log In
              </Link>

              <button
                onClick={() => {
                  open("searchRenter");
                  setMobileOpen(false);
                }}
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
