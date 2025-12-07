"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import StartScreeningButton from "@/components/StartScreeningButton";

// TEMP MOCK ANNOUNCEMENT – replace later with API
const announcement = {
  enabled: true,
  message: "🚀 RentFAX Beta is Live — Full Report System Launching Soon!",
  cta: "Join Beta",
  href: "/signup",
};

export default function UnifiedHeader() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);

  /* --------------------------------------------
   * SCROLL BEHAVIOR (Hide on scroll down)
   * -------------------------------------------- */
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;

      if (current > lastScroll && current > 50) {
        setShowHeader(false); // hide on scroll down
      } else {
        setShowHeader(true); // show on scroll up
      }

      setLastScroll(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  /* --------------------------------------------
   * RENDER
   * -------------------------------------------- */
  return (
    <header className="fixed top-0 left-0 w-full z-[1000] bg-white shadow-sm transition-transform duration-300"
      style={{ transform: showHeader ? "translateY(0)" : "translateY(-110%)" }}
    >

      {/* --------------------------------------------
          ANNOUNCEMENT BAR
      -------------------------------------------- */}
      {announcement.enabled && (
        <div className="bg-[#1A2540] text-white text-xs sm:text-sm py-2 px-4 text-center flex flex-col sm:flex-row sm:items-center sm:justify-center gap-1">

          <span>{announcement.message}</span>

          {announcement.cta && (
            <Link
              href={announcement.href}
              className="underline font-semibold hover:opacity-80"
            >
              {announcement.cta}
            </Link>
          )}
        </div>
      )}

      {/* --------------------------------------------
          MAIN NAVBAR
      -------------------------------------------- */}
      <nav className="bg-white px-4 sm:px-6 py-4 flex items-center justify-between border-b border-gray-200">

        {/* LOGO */}
        <Link href="/" className="text-lg sm:text-xl font-bold text-[#1A2540]">
          RentFAX
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/how-it-works" className="text-sm hover:text-[#1A2540]">
            How It Works
          </Link>
          <Link href="/pricing" className="text-sm hover:text-[#1A2540]">
            Pricing
          </Link>
          <Link href="/blog" className="text-sm hover:text-[#1A2540]">
            Blog
          </Link>

          <Link
            href="/login"
            className="text-sm px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Login
          </Link>

          <StartScreeningButton className="ml-4" />

        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* --------------------------------------------
          MOBILE SLIDE-DOWN MENU
      -------------------------------------------- */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-4">

          <Link href="/how-it-works" className="block text-sm">
            How It Works
          </Link>

          <Link href="/pricing" className="block text-sm">
            Pricing
          </Link>

          <Link href="/blog" className="block text-sm">
            Blog
          </Link>

          <Link
            href="/login"
            className="block text-sm py-2 border rounded-lg text-center"
          >
            Login
          </Link>
          
          <StartScreeningButton className="w-full mt-4" />
        </div>
      )}
    </header>
  );
}
