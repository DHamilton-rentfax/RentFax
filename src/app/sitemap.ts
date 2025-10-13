import { adminDB } from "@/lib/firebase-admin";

export default async function sitemap() {
  const baseUrl = "https://rentfax.io";

  // Static pages
  const routes = [
    "",
    "/about",
    "/how-it-works",
    "/pricing",
    "/contact",
    "/careers",
    "/blog",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  // Dynamic blog posts
  let blogRoutes: { url: string; lastModified: Date }[] = [];
  try {
    const snap = await adminDB
      .collection("blogs")
      .where("published", "==", true)
      .get();
    blogRoutes = snap.docs.map((doc) => ({
      url: `${baseUrl}/blog/${doc.data().slug || doc.id}`,
      lastModified: doc.data().createdAt?.toDate() || new Date(),
    }));
  } catch (e) {
    console.warn("Error building blog sitemap:", e);
  }

  return [...routes, ...blogRoutes];
}
