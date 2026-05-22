import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseAdminEnv } from "@/lib/supabase/config";
import { requireActiveAdmin } from "@/lib/admin/auth";
import { getCmsFooter, getCmsPage, getCmsPages } from "@/lib/cms/content";
import { defaultFooterSettings, editablePages } from "@/lib/cms/defaults";
import type { CmsPageSlug } from "@/lib/cms/defaults";
import type { Json } from "@/types/database";

const pageSlugs = editablePages.map((page) => page.slug) as [string, ...string[]];

const pageSchema = z.object({
  slug: z.enum(pageSlugs),
  title: z.string().min(1).max(80),
  status: z.enum(["draft", "published"]),
  hero_eyebrow: z.string().max(80),
  hero_title: z.string().min(1).max(140),
  hero_description: z.string().min(1).max(420),
  hero_image: z.string().min(1).max(300),
  seo_title: z.string().min(1).max(80),
  seo_description: z.string().min(1).max(180),
  content: z.record(z.string(), z.unknown()),
});

const footerSchema = z.object({
  description: z.string().min(1).max(260),
  address: z.string().min(1).max(220),
  reservationPhone: z.string().min(1).max(40),
  frontDeskPhone: z.string().min(1).max(40),
  email: z.string().email(),
  socials: z
    .array(z.object({ label: z.string().min(1).max(30), href: z.string().url() }))
    .max(6),
});

const patchSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("page"), page: pageSchema }),
  z.object({ type: z.literal("footer"), footer: footerSchema }),
]);

export async function GET() {
  const auth = await requireActiveAdmin(["super_admin", "manager"]);
  if (auth.error) return auth.error;

  const [pages, footer] = await Promise.all([getCmsPages(), getCmsFooter()]);
  return NextResponse.json({ pages, footer });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireActiveAdmin(["super_admin", "manager"]);
  if (auth.error) return auth.error;
  const { user } = auth;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (!hasSupabaseAdminEnv()) {
    return NextResponse.json({
      success: true,
      demo: true,
      page: parsed.data.type === "page" ? await getCmsPage(parsed.data.page.slug as CmsPageSlug) : undefined,
      footer: parsed.data.type === "footer" ? defaultFooterSettings : undefined,
    });
  }

  const admin = createAdminClient();

  if (parsed.data.type === "page") {
    const page = parsed.data.page;
    const { error } = await admin.from("cms_pages").upsert({
      ...page,
      content: page.content as Json,
      updated_by: user.id,
      published_at: page.status === "published" ? new Date().toISOString() : null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await admin.from("audit_log").insert({
      action: "update_cms_page",
      admin_user_id: user.id,
      entity_type: "cms_page",
      entity_id: page.slug,
      details: { status: page.status, title: page.title },
    });

    revalidatePath("/");
    revalidatePath(`/${page.slug === "home" ? "" : page.slug}`);
    revalidatePath("/cms");
    revalidatePath(`/cms/pages/${page.slug}`);
    return NextResponse.json({ success: true, page });
  }

  const { error } = await admin.from("cms_site_settings").upsert({
    key: "footer",
    content: parsed.data.footer as Json,
    updated_by: user.id,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await admin.from("audit_log").insert({
    action: "update_cms_footer",
    admin_user_id: user.id,
    entity_type: "cms_site_settings",
    entity_id: "footer",
    details: { email: parsed.data.footer.email },
  });

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/conference");
  revalidatePath("/menu");
  revalidatePath("/guest-guide");
  revalidatePath("/laundry");
  revalidatePath("/contact");
  revalidatePath("/cms");
  return NextResponse.json({ success: true, footer: parsed.data.footer });
}
