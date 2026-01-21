import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/pricing",
          "/how-it-works",
          "/blog",
          "/integrations",
          "/investors",
          "/landlords",
          "/security",
          "/trust",
        ],
        disallow: [
          "/dashboard",
          "/admin",
          "/superadmin",
          "/staff",
          "/support",
          "/renter",
          "/company",
          "/agency",
          "/auth",
          "/login",
          "/signup",
          "/checkout",
          "/api",
        ],
      },
    ],
    sitemap: "https://www.rentfax.io/sitemap.xml",
  };
}
