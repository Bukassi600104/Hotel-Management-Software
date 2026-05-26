import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.url.replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/booking/checkout",
          "/booking/confirm",
          "/booking/failed",
          "/booking/success",
          "/cms/",
          "/rooms/*/reserve",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
