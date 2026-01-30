// src/app/sitemap.ts
import type { MetadataRoute } from "next";

const BASE_URL = "https://www.rentfax.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "", priority: 1.0 },
    { path: "/pricing", priority: 0.9 },
    { path: "/how-it-works", priority: 0.9 },
    { path: "/landlords", priority: 0.85 },
    { path: "/renters", priority: 0.85 },
    { path: "/enterprise", priority: 0.85 },
    { path: "/partners", priority: 0.8 },
    { path: "/blog", priority: 0.8 },
    { path: "/about", priority: 0.7 },
    { path: "/careers", priority: 0.7 },
    { path: "/investors", priority: 0.7 },
    { path: "/risk-score", priority: 0.7 },
    { path: "/methodology", priority: 0.7 },
    { path: "/trust", priority: 0.7 },
    { path: "/security", priority: 0.6 },
    { path: "/privacy", priority: 0.5 },
    { path: "/terms", priority: 0.5 },
    { path: "/compliance", priority: 0.6 },
    { path: "/ai-transparency", priority: 0.6 },
    { path: "/accessibility", priority: 0.4 },
    { path: "/developers", priority: 0.6 },
    { path: "/docs", priority: 0.6 },
    { path: "/press", priority: 0.6 },
    { path: "/faq", priority: 0.6 },
    { path: "/support", priority: 0.5 },
    { path: "/status", priority: 0.5 },
    { path: "/technology", priority: 0.7 },
    { path: "/why-rentfax", priority: 0.8 },
    { path: "/success-stories", priority: 0.8 },
  ];

  return routes.map(({ path, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly",
    priority,
  }));
}
