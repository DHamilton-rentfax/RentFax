import Link from "next/link";
import Image from "next/image";

export default function BlogCard({ post }: { post: any }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="border rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition"
    >
      <div className="relative h-48 w-full">
        <Image
          src={post.coverImage || "/images/blog-default.jpg"}
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-5 space-y-2">
        <h3 className="text-lg font-semibold text-[#1A2540]">
          {post.title}
        </h3>

        <p className="text-gray-600 text-sm line-clamp-3">
          {post.excerpt}
        </p>

        <p className="text-xs text-gray-400">
          {new Date(post.createdAt).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
}
