import BlogClientPage from "./BlogClientPage";

export const metadata = {
  title: "RentFAX Blog | Insights, Updates, and Resources",
  description:
    "Explore the latest articles on renter safety, fraud detection, rental technology, and industry insights from the RentFAX team.",
  openGraph: {
    title: "RentFAX Blog | Insights, Updates, and Resources",
    description:
      "Learn how RentFAX is changing the rental landscape with AI, compliance, and transparency.",
    url: "https://rentfax.io/blogs",
    siteName: "RentFAX",
    images: [
      {
        url: "https://rentfax.io/images/og-blog.jpg",
        width: 1200,
        height: 630,
        alt: "RentFAX Blog",
      },
    ],
  },
};

export default function BlogsPage() {
  return <BlogClientPage />;
}
