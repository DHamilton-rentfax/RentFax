// src/app/sitemap.ts
import type { MetadataRoute } from "next";

const BASE_URL = "https://www.rentfax.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/pricing",
    "/how-it-works",
    "/blog",
    "/contact",
    "/careers",
    "/partners",
    "/integrations",
    "/investors",
    "/landlords",
    "/renters",
    "/risk-score",
    "/methodology",
    "/trust",
    "/security",
    "/privacy",
    "/terms",
    "/compliance",
    "/ai-transparency",
    "/accessibility",
    "/developers",
    "/docs",
    "/enterprise",
    "/press",
    "/faq",
    "/support",
    "/system-status",
    "/status",
    "/technology",
    "/why-rentfax",
    "/success-stories",
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.7,
  }));
}
