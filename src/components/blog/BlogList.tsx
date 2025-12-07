import BlogCard from "./BlogCard";

export default function BlogList({ posts }: { posts: any[] }) {
  if (!posts || posts.length === 0) {
    return <p className="text-gray-500">No posts found.</p>;
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
