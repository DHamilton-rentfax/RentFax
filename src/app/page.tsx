"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/client";

type Post = {
    slug: string;
    title: string;
    date: string;
    read: string;
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, "blogs"), orderBy("date", "desc"), limit(3));
      const snapshot = await getDocs(q);
      setPosts(snapshot.docs.map(doc => ({ slug: doc.id, ...doc.data() } as Post)));
    };
    fetchPosts();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative">
        <div className="mx-auto max-w-5xl px-6 pt-24 pb-10 text-center">
          <h1 className="font-[var(--font-newsreader)] text-5xl md:text-6xl leading-tight tracking-tight">
            Smarter Risk. <span className="text-zinc-500">Safer Rentals.</span>
          </h1>
          <p className="mt-6 text-lg text-zinc-600 max-w-2xl mx-auto">
            Real-time risk scoring, fraud detection, and transparent dispute workflows —
            built for modern rental teams.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/signup" className="rounded-full bg-black text-white px-5 py-2.5 text-sm hover:bg-zinc-900">
              Start free
            </Link>
            <Link href="/pricing" className="rounded-full border border-black/10 px-5 py-2.5 text-sm hover:bg-black/5">
              See pricing
            </Link>
          </div>
        </div>

        {/* Logo cloud */}
        <div className="mx-auto max-w-6xl px-6 pb-16">
          <div className="grid grid-cols-2 md:grid-cols-6 items-center gap-x-10 gap-y-6 opacity-70">
            {["stripe","plaid","firebase","vercel","aws","gcp"].map(k => (
              <div key={k} className="flex items-center justify-center">
                <img src={`/logos/${k}.svg`} alt={k} className="h-8" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3-up value props (quiet cards) */}
      <section className="border-t border-black/5 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 grid gap-10 md:grid-cols-3">
          {[
            { t: "AI Risk Scores", d: "Instant signals on fraud, duplicate identity, shared addresses, and more." },
            { t: "Dispute Portal", d: "Give renters a fair, documented path to resolution. Reduce chargebacks." },
            { t: "Enterprise Security", d: "Encryption in transit/at rest, audit logs, SSO, SOC2-aligned workflows." },
          ].map((f) => (
            <div key={f.t} className="rounded-2xl border border-black/5 p-8 hover:shadow-sm transition">
              <div className="text-xs uppercase tracking-wider text-zinc-500">Capability</div>
              <h3 className="mt-2 text-xl font-medium">{f.t}</h3>
              <p className="mt-3 text-zinc-600">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product spotlight (device frame) */}
      <section className="border-t border-black/5">
        <div className="mx-auto max-w-6xl px-6 py-20 grid gap-10 md:grid-cols-2 items-center">
          <div>
            <h2 className="font-[var(--font-newsreader)] text-3xl md:text-4xl leading-tight">
              See risks before they become losses.
            </h2>
            <p className="mt-4 text-zinc-600">
              Upload renter data or connect APIs. Our engine runs checks, scores risk,
              and surfaces explanations so your team can act decisively.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-zinc-700">
              <li>• Duplicate identity & shared address detection</li>
              <li>• Payment risk & chargeback likelihood</li>
              <li>• Audit trail of decisions & disputes</li>
            </ul>
            <div className="mt-6 flex gap-3">
              <Link href="/signup" className="rounded-full bg-black text-white px-5 py-2.5 text-sm hover:bg-zinc-900">
                Try a sample report
              </Link>
              <Link href="/contact" className="rounded-full border border-black/10 px-5 py-2.5 text-sm hover:bg-black/5">
                Talk to sales
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-2 shadow-sm">
            <img src="/screens/risk-dashboard.png" alt="Risk dashboard" className="rounded-xl" />
          </div>
        </div>
      </section>

      {/* Metrics row */}
      <section className="border-t border-black/5 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-14 grid gap-8 md:grid-cols-3 text-center">
          {[
            { n: "45%", l: "fewer loss events" },
            { n: "5k+", l: "reports / month" },
            { n: "99.95%", l: "uptime (SLA)" },
          ].map((m) => (
            <div key={m.l}>
              <div className="text-4xl font-[var(--font-newsreader)]">{m.n}</div>
              <div className="mt-2 text-zinc-600">{m.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials (quiet editorial) */}
      <section className="border-t border-black/5">
        <div className="mx-auto max-w-5xl px-6 py-20 grid gap-10 md:grid-cols-3">
          {[
            { q: "Caught bad apps before keys were handed over.", a: "Fleet Ops Lead" },
            { q: "The dispute portal cut our chargebacks in half.", a: "Owner, Rentals NYC" },
            { q: "Executive-level clarity on risk in one place.", a: "CFO, PropCo" },
          ].map((t) => (
            <div key={t.q} className="space-y-3">
              <p className="italic">“{t.q}”</p>
              <div className="text-sm text-zinc-600">— {t.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Blog preview (Adaline-style section) */}
      <section className="border-t border-black/5 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="flex items-end justify-between">
            <h2 className="font-[var(--font-newsreader)] text-3xl">From the Lab</h2>
            <Link href="/blog" className="text-sm text-zinc-700 hover:text-black">All posts →</Link>
          </div>
          <div className="mt-8 divide-y divide-black/5">
            {posts.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="block py-5 hover:bg-black/2 rounded-lg">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-lg md:text-xl font-medium leading-snug">{p.title}</h3>
                  <div className="hidden md:block text-sm text-zinc-500">{p.date} · {p.read}</div>
                </div>
                <div className="mt-1 md:hidden text-sm text-zinc-500">{p.date} · {p.read}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-black/5">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <h2 className="font-[var(--font-newsreader)] text-3xl md:text-4xl">Ready to protect your rentals?</h2>
          <p className="mt-4 text-zinc-600">Start free, invite your team, and see risk clearly.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/signup" className="rounded-full bg-black text-white px-5 py-2.5 text-sm hover:bg-zinc-900">Get started</Link>
            <Link href="/contact" className="rounded-full border border-black/10 px-5 py-2.5 text-sm hover:bg-black/5">Contact sales</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
