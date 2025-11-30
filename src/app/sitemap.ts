import { MetadataRoute } from 'next';

import { adminDB } from "@/firebase/server-admin";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://rentfax.io";

  // Static pages
  const routes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/how-it-works",
    "/pricing",
    "/contact",
    "/careers",
    "/blog",
    "/reports/end-of-rental",
    "/legal/partners",
    "/legal/collections",
    "/legal/api",
    "/legal/data-deletion",
    "/legal/dmca",
    "/legal/cookies",
    "/security",
    "/security/disclosure",
    "/ai-transparency",
    "/accessibility",
    "/partners",
    "/integrations",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  // Dynamic blog posts
  let blogRoutes: MetadataRoute.Sitemap = [];
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
