"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useState, useEffect } from "react";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/pricing", label: "Pricing" },
    { href: "/partners", label: "Partners" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-6">
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight text-[#1B2A4E]"
        >
          RentFAX
        </Link>

        <nav className="hidden md:flex space-x-8 text-sm font-medium text-[#111827]/80">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                "hover:text-[#E6B422] transition-colors",
                pathname === href && "text-[#E6B422] font-semibold"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex space-x-4">
          <Link
            href="/login"
            className="text-sm font-medium text-[#1B2A4E] hover:text-[#E6B422] transition"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold bg-[#1B2A4E] text-white px-5 py-2 rounded-lg hover:bg-[#E6B422] hover:text-[#1B2A4E] transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
