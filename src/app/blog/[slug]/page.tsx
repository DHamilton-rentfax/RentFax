
import { notFound } from "next/navigation";
import Image from "next/image";
import { posts } from "@/content/posts";

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 pt-16 pb-24">
      <p className="text-sm text-zinc-500">{post.date} · {post.read}</p>
      <h1 className="mt-3 font-[var(--font-newsreader)] text-4xl md:text-5xl leading-tight">{post.title}</h1>
      <div className="relative w-full h-96 my-8 rounded-2xl overflow-hidden">
        <Image 
            src={post.image.src}
            alt={post.title}
            fill
            className="object-cover"
            data-ai-hint={post.image.hint}
        />
      </div>
      <div className="prose prose-zinc mt-8">
        {post.body}
      </div>
    </article>
  );
}
