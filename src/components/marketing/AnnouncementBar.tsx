"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Announcement = {
  id: string;
  label?: string;
  message: string;
  ctaLabel?: string;
  ctaHref?: string;
  priority?: "low" | "normal" | "high";
};

const FALLBACK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "driver-id-flows",
    label: "NEW FEATURE",
    message:
      "New: Driver & ID verification flows are now live. Instantly verify renters before handing over keys.",
    ctaLabel: "View pricing",
    ctaHref: "/pricing",
    priority: "high",
  },
];

const STORAGE_KEY = "rentfax_announcement_dismissed_ids_v2";

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [index, setIndex] = useState(0);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  // Load dismissed ids from localStorage
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setDismissedIds(parsed);
    } catch {
      // ignore
    }
  }, []);

  // Fetch announcements from API (best-effort)
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/announcements?scope=public", {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch announcements");

        const data = await res.json();

        if (!Array.isArray(data?.items) || cancelled) {
          setAnnouncements(FALLBACK_ANNOUNCEMENTS);
          return;
        }

        const mapped: Announcement[] = data.items.map((a: any) => ({
          id: a.id ?? a.slug ?? String(a.createdAt ?? Date.now()),
          label: a.label ?? a.type ?? undefined,
          message: a.message ?? "",
          ctaLabel: a.ctaLabel ?? undefined,
          ctaHref: a.ctaHref ?? undefined,
          priority: a.priority ?? "normal",
        }));

        setAnnouncements(mapped.length ? mapped : FALLBACK_ANNOUNCEMENTS);
      } catch {
        if (!cancelled) setAnnouncements(FALLBACK_ANNOUNCEMENTS);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleAnnouncements = useMemo(
    () =>
      announcements.filter((a) => !dismissedIds.includes(a.id)),
    [announcements, dismissedIds]
  );

  const current = visibleAnnouncements[index] ?? null;

  // Auto-advance
  useEffect(() => {
    if (!current || visibleAnnouncements.length <= 1) return;

    const id = window.setInterval(() => {
      setIndex((prev) =>
        (prev + 1) % visibleAnnouncements.length
      );
    }, 10000);

    return () => window.clearInterval(id);
  }, [current, visibleAnnouncements.length]);

  const handleDismiss = () => {
    if (!current) return;
    const nextDismissed = [...dismissedIds, current.id];
    setDismissedIds(nextDismissed);
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(nextDismissed)
      );
    } catch {
      // ignore
    }

    if (visibleAnnouncements.length <= 1) return;
    setIndex((prev) =>
      prev >= visibleAnnouncements.length - 1 ? 0 : prev + 1
    );
  };

  const goPrev = () => {
    if (visibleAnnouncements.length <= 1) return;
    setIndex((prev) =>
      prev === 0 ? visibleAnnouncements.length - 1 : prev - 1
    );
  };

  const goNext = () => {
    if (visibleAnnouncements.length <= 1) return;
    setIndex((prev) =>
      (prev + 1) % visibleAnnouncements.length
    );
  };

  if (!current) return null;

  const priorityClass =
    current.priority === "high"
      ? "from-[#f97316] to-[#f59e0b]"
      : current.priority === "low"
      ? "from-[#facc15] to-[#fde68a]"
      : "from-[#fbbf24] to-[#f97316]";

  return (
    <div className={`w-full bg-gradient-to-r ${priorityClass} text-white`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between gap-2 py-2 text-xs sm:text-sm">
          {/* Left controls */}
          <div className="flex items-center gap-1 sm:gap-2">
            {visibleAnnouncements.length > 1 && (
              <button
                onClick={goPrev}
                className="p-1 rounded-full hover:bg-white/10 transition hidden sm:inline-flex"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}

            {current.label && (
              <span className="px-2 py-0.5 rounded-full bg-white/15 text-[10px] sm:text-[11px] font-semibold tracking-wide uppercase">
                {current.label}
              </span>
            )}

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.id}
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-1 sm:gap-2"
              >
                <span className="truncate">
                  {current.message}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* CTA + controls on the right */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {current.ctaHref && current.ctaLabel && (
              <Link
                href={current.ctaHref}
                className="hidden sm:inline-flex px-3 py-1 rounded-full bg-white/90 text-[#1A2540] text-xs font-semibold hover:bg-white"
              >
                {current.ctaLabel}
              </Link>
            )}

            {visibleAnnouncements.length > 1 && (
              <button
                onClick={goNext}
                className="p-1 rounded-full hover:bg-white/10 transition hidden sm:inline-flex"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            )}

            <button
              onClick={handleDismiss}
              className="p-1 rounded-full hover:bg-white/10 transition"
              aria-label="Dismiss announcement"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
