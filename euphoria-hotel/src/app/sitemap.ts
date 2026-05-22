import type { MetadataRoute } from "next";

import { rooms } from "@/lib/data/rooms";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/rooms",
    "/about",
    "/conference",
    "/menu",
    "/guest-guide",
    "/laundry",
    "/contact",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  const roomRoutes: MetadataRoute.Sitemap = rooms.map((r) => ({
    url: `${base}/rooms/${r.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...roomRoutes];
}
