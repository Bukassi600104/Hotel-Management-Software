import type { MetadataRoute } from "next";

import { rooms } from "@/lib/data/rooms";
import { absoluteUrl, publicSeoRoutes } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = publicSeoRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const roomRoutes: MetadataRoute.Sitemap = rooms.map((r) => ({
    url: absoluteUrl(`/rooms/${r.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...roomRoutes];
}
