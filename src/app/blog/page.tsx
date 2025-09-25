
import Link from "next/link";
import { posts } from "@/content/posts";

export default function BlogIndex() {
  return (
    <div className="mx-auto max-w-5xl px-6 pt-16 pb-24">
      <h1 className="font-[var(--font-newsreader)] text-4xl md:text-5xl tracking-tight">RentFAX Lab</h1>
      <p className="mt-4 text-lg text-zinc-600 max-w-2xl">
        Research notes, product thinking, and experiments from the team.
      </p>

      <div className="mt-10 divide-y divide-black/5">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="block py-6 group">
            <div className="flex items-baseline justify-between gap-6">
              <h2 className="text-xl md:text-2xl font-medium leading-snug group-hover:underline">{p.title}</h2>
              <div className="hidden md:block text-sm text-zinc-500 shrink-0">{p.date} · {p.read}</div>
            </div>
            <p className="mt-2 text-zinc-600">{p.excerpt}</p>
            <div className="mt-2 md:hidden text-sm text-zinc-500">{p.date} · {p.read}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
