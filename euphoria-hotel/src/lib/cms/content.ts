import { unstable_noStore as noStore } from "next/cache";
import type { Json } from "@/types/database";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseAdminEnv } from "@/lib/supabase/config";
import {
  defaultCmsPages,
  defaultFooterSettings,
  editablePages,
  type CmsFooterSettings,
  type CmsPage,
  type CmsPageSlug,
} from "@/lib/cms/defaults";

type CmsPageRow = Omit<CmsPage, "slug" | "status" | "content"> & {
  slug: string;
  status: string;
  content: Json;
};

type CmsSettingsRow = {
  key: string;
  content: Json;
};

function isRecord(value: Json | unknown): value is Record<string, Json> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function mergePage(slug: CmsPageSlug, row?: Partial<CmsPageRow> | null): CmsPage {
  const fallback = defaultCmsPages[slug];
  if (!row) return fallback;
  return {
    ...fallback,
    ...row,
    slug,
    status: row.status === "draft" ? "draft" : "published",
    content: {
      ...fallback.content,
      ...(isRecord(row.content) ? row.content : {}),
    },
  };
}

function mergeFooter(row?: CmsSettingsRow | null): CmsFooterSettings {
  if (!isRecord(row?.content)) return defaultFooterSettings;
  return {
    ...defaultFooterSettings,
    ...row.content,
    socials: Array.isArray(row.content.socials)
      ? row.content.socials
          .filter((item): item is { label: string; href: string } => {
            if (!item || typeof item !== "object" || Array.isArray(item)) return false;
            const social = item as Record<string, unknown>;
            return typeof social.label === "string" && typeof social.href === "string";
          })
          .slice(0, 6)
      : defaultFooterSettings.socials,
  };
}

export async function getCmsPage(slug: CmsPageSlug): Promise<CmsPage> {
  noStore();
  if (!hasSupabaseAdminEnv()) return defaultCmsPages[slug];

  try {
    const admin = createAdminClient();
    const { data } = await admin.from("cms_pages").select("*").eq("slug", slug).single();
    return mergePage(slug, data as CmsPageRow | null);
  } catch {
    return defaultCmsPages[slug];
  }
}

export async function getCmsPages(): Promise<CmsPage[]> {
  noStore();
  if (!hasSupabaseAdminEnv()) return editablePages.map((page) => defaultCmsPages[page.slug]);

  try {
    const admin = createAdminClient();
    const { data } = await admin.from("cms_pages").select("*").order("slug", { ascending: true });
    const rows = (data ?? []) as CmsPageRow[];
    return editablePages.map((page) => mergePage(page.slug, rows.find((row) => row.slug === page.slug)));
  } catch {
    return editablePages.map((page) => defaultCmsPages[page.slug]);
  }
}

export async function getCmsFooter(): Promise<CmsFooterSettings> {
  noStore();
  if (!hasSupabaseAdminEnv()) return defaultFooterSettings;

  try {
    const admin = createAdminClient();
    const { data } = await admin.from("cms_site_settings").select("*").eq("key", "footer").single();
    return mergeFooter(data as CmsSettingsRow | null);
  } catch {
    return defaultFooterSettings;
  }
}
