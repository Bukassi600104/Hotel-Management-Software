"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Eye, Image as ImageIcon, Loader2, Save, Send } from "lucide-react";
import { toast } from "sonner";
import {
  cmsMediaLibrary,
  editablePages,
  type CmsFooterSettings,
  type CmsPage,
  type CmsPageSlug,
} from "@/lib/cms/defaults";
import { cn } from "@/lib/utils";

type Props = {
  page: CmsPage;
  footer: CmsFooterSettings;
};

const contentFields: Record<CmsPageSlug, Array<{ key: string; label: string; type?: "textarea" | "text" }>> = {
  home: [
    { key: "aboutLabel", label: "Homepage about label" },
    { key: "aboutTitle", label: "Homepage about title", type: "textarea" },
    { key: "aboutSubtitle", label: "Homepage about subtitle" },
    { key: "aboutBody", label: "Homepage about body", type: "textarea" },
    { key: "aboutImageOne", label: "About image one" },
    { key: "aboutImageTwo", label: "About image two" },
    { key: "ctaLabel", label: "CTA label" },
    { key: "ctaTitle", label: "CTA title" },
    { key: "ctaButtonText", label: "CTA button text" },
    { key: "ctaButtonHref", label: "CTA button link" },
    { key: "ctaImage", label: "CTA image" },
  ],
  about: [
    { key: "storyEyebrow", label: "Story eyebrow" },
    { key: "storyTitle", label: "Story title" },
    { key: "storyBodyOne", label: "Story paragraph 1", type: "textarea" },
    { key: "storyBodyTwo", label: "Story paragraph 2", type: "textarea" },
    { key: "storyBodyThree", label: "Story paragraph 3", type: "textarea" },
    { key: "ctaTitle", label: "CTA title" },
    { key: "ctaBody", label: "CTA body", type: "textarea" },
  ],
  conference: [
    { key: "introEyebrow", label: "Intro eyebrow" },
    { key: "introTitle", label: "Intro title" },
    { key: "layoutTitle", label: "Layout section title" },
    { key: "layoutBody", label: "Layout section body", type: "textarea" },
    { key: "formTitle", label: "Form intro title" },
    { key: "formBody", label: "Form intro body", type: "textarea" },
    { key: "ctaTitle", label: "CTA title" },
    { key: "ctaBody", label: "CTA body", type: "textarea" },
  ],
  menu: [
    { key: "introBody", label: "Menu intro body", type: "textarea" },
    { key: "foodImage", label: "Food section image" },
    { key: "foodMenu", label: "Food menu sections", type: "textarea" },
    { key: "breakfastImage", label: "Breakfast section image" },
    { key: "breakfastMenu", label: "Breakfast menu sections", type: "textarea" },
    { key: "drinksImage", label: "Drinks section image" },
    { key: "drinksMenu", label: "Drink menu sections", type: "textarea" },
    { key: "ctaTitle", label: "CTA title" },
    { key: "ctaBody", label: "CTA body", type: "textarea" },
    { key: "ctaButtonText", label: "CTA button text" },
    { key: "ctaButtonHref", label: "CTA button link" },
  ],
  "guest-guide": [
    { key: "introTitle", label: "Intro title" },
    { key: "introBody", label: "Intro body", type: "textarea" },
    { key: "serviceNumbers", label: "Service numbers", type: "textarea" },
    { key: "breakfastTitle", label: "Breakfast title" },
    { key: "breakfastSchedule", label: "Breakfast schedule", type: "textarea" },
    { key: "breakfastNote", label: "Breakfast note", type: "textarea" },
    { key: "ctaTitle", label: "CTA title" },
    { key: "ctaBody", label: "CTA body", type: "textarea" },
  ],
  laundry: [
    { key: "introTitle", label: "Intro title" },
    { key: "introBody", label: "Intro body", type: "textarea" },
    { key: "intercom", label: "Intercom number" },
    { key: "laundryImage", label: "Laundry image 1" },
    { key: "laundryImageTwo", label: "Laundry image 2" },
    { key: "laundryImageThree", label: "Laundry image 3" },
    { key: "serviceNote", label: "Service note", type: "textarea" },
    { key: "laundryTariff", label: "Laundry tariff", type: "textarea" },
    { key: "ctaTitle", label: "CTA title" },
    { key: "ctaBody", label: "CTA body", type: "textarea" },
  ],
  contact: [
    { key: "infoEyebrow", label: "Contact info eyebrow" },
    { key: "infoTitle", label: "Contact info title" },
    { key: "socialTitle", label: "Social section title" },
  ],
};

export function CmsPageEditor({ page, footer }: Props) {
  const [draft, setDraft] = React.useState(page);
  const [footerDraft, setFooterDraft] = React.useState(footer);
  const [saving, setSaving] = React.useState<"draft" | "publish" | "footer" | null>(null);
  const pageMeta = editablePages.find((item) => item.slug === page.slug);

  function setPageField(field: keyof CmsPage, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function setContentField(key: string, value: string) {
    setDraft((current) => ({ ...current, content: { ...current.content, [key]: value } }));
  }

  function setFooterField(field: keyof CmsFooterSettings, value: string) {
    setFooterDraft((current) => ({ ...current, [field]: value }));
  }

  function setSocial(index: number, field: "label" | "href", value: string) {
    setFooterDraft((current) => ({
      ...current,
      socials: current.socials.map((social, idx) => (idx === index ? { ...social, [field]: value } : social)),
    }));
  }

  async function savePage(status: "draft" | "published") {
    setSaving(status === "draft" ? "draft" : "publish");
    const response = await fetch("/api/cms/content", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: "page", page: { ...draft, status } }),
    });
    setSaving(null);
    if (!response.ok) {
      toast.error("Could not save page content.");
      return;
    }
    setDraft((current) => ({
      ...current,
      status,
      published_at: status === "published" ? new Date().toISOString() : current.published_at,
    }));
    toast.success(status === "published" ? "Page published." : "Draft saved.");
  }

  async function saveFooter() {
    setSaving("footer");
    const response = await fetch("/api/cms/content", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: "footer", footer: footerDraft }),
    });
    setSaving(null);
    if (!response.ok) {
      toast.error("Could not save footer settings.");
      return;
    }
    toast.success("Footer settings saved.");
  }

  return (
    <div className="px-5 py-8 lg:px-9 lg:py-10">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Link href="/cms" className="inline-flex items-center gap-2 text-sm text-[#756d5e] hover:text-[#8b6b24]">
            <ArrowLeft className="size-4" />
            Back to CMS
          </Link>
          <p className="mt-5 text-[11px] uppercase tracking-[0.42em] text-[#c9a961]">Guided Page Editor</p>
          <h1 className="mt-3 font-heading text-4xl tracking-tight text-[#151515] lg:text-5xl">{page.title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#6f6757]">
            Edit approved content fields for this page. Layout and booking operations are managed separately.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={pageMeta?.href ?? "/"}
            target="_blank"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#eadfca] bg-white px-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#5f5748] hover:border-[#c9a961]/50 hover:text-[#8b6b24]"
          >
            <Eye className="size-4" />
            Preview
          </Link>
          <button
            onClick={() => savePage("draft")}
            disabled={saving !== null}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#eadfca] bg-white px-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#5f5748] hover:border-[#c9a961]/50 hover:text-[#8b6b24] disabled:opacity-50"
          >
            {saving === "draft" ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save Draft
          </button>
          <button
            onClick={() => savePage("published")}
            disabled={saving !== null}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#c9a961] px-4 text-xs font-bold uppercase tracking-[0.16em] text-[#151515] disabled:opacity-50"
          >
            {saving === "publish" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            Publish
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <Panel title="Page hero" id="hero">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Internal title" value={draft.title} onChange={(value) => setPageField("title", value)} />
              <Field label="Hero eyebrow" value={draft.hero_eyebrow} onChange={(value) => setPageField("hero_eyebrow", value)} />
              <Field label="Hero title" value={draft.hero_title} onChange={(value) => setPageField("hero_title", value)} />
              <Field label="Hero image path" value={draft.hero_image} onChange={(value) => setPageField("hero_image", value)} />
              <Field
                label="Hero description"
                value={draft.hero_description}
                onChange={(value) => setPageField("hero_description", value)}
                textarea
                className="md:col-span-2"
              />
            </div>
          </Panel>

          <Panel title="Page content">
            <div className="grid gap-4">
              {contentFields[draft.slug].map((field) => (
                <Field
                  key={field.key}
                  label={field.label}
                  value={String(draft.content[field.key] ?? "")}
                  onChange={(value) => setContentField(field.key, value)}
                  textarea={field.type === "textarea"}
                />
              ))}
            </div>
          </Panel>

          <Panel title="SEO">
            <div className="grid gap-4">
              <Field label="SEO title" value={draft.seo_title} onChange={(value) => setPageField("seo_title", value)} />
              <Field
                label="SEO description"
                value={draft.seo_description}
                onChange={(value) => setPageField("seo_description", value)}
                textarea
              />
            </div>
          </Panel>

          {draft.slug === "contact" && (
            <Panel title="Footer and contact settings" id="footer">
              <div className="grid gap-4">
                <Field label="Footer description" value={footerDraft.description} onChange={(value) => setFooterField("description", value)} textarea />
                <Field label="Address" value={footerDraft.address} onChange={(value) => setFooterField("address", value)} textarea />
                <div className="grid gap-4 md:grid-cols-3">
                  <Field label="Reservation phone" value={footerDraft.reservationPhone} onChange={(value) => setFooterField("reservationPhone", value)} />
                  <Field label="Front desk phone" value={footerDraft.frontDeskPhone} onChange={(value) => setFooterField("frontDeskPhone", value)} />
                  <Field label="Email" value={footerDraft.email} onChange={(value) => setFooterField("email", value)} />
                </div>
                <div className="grid gap-3">
                  {footerDraft.socials.map((social, index) => (
                    <div key={index} className="grid gap-3 md:grid-cols-[160px_1fr]">
                      <Field label={`Social ${index + 1}`} value={social.label} onChange={(value) => setSocial(index, "label", value)} />
                      <Field label="Link" value={social.href} onChange={(value) => setSocial(index, "href", value)} />
                    </div>
                  ))}
                </div>
                <button
                  onClick={saveFooter}
                  disabled={saving !== null}
                  className="w-fit rounded-lg bg-[#c9a961] px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#151515]"
                >
                  {saving === "footer" ? "Saving..." : "Save Footer Settings"}
                </button>
              </div>
            </Panel>
          )}
        </div>

        <aside className="space-y-5">
          <div className="rounded-lg border border-[#eadfca] bg-white p-5 shadow-[0_18px_45px_rgba(33,25,12,0.05)]">
            <p className="text-xs uppercase tracking-[0.24em] text-[#82796a]">Status</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="rounded-full border border-[#c9a961]/25 bg-[#c9a961]/10 px-3 py-1 text-xs capitalize text-[#c9a961]">
                {draft.status}
              </span>
              <span className="text-xs text-[#756d5e]">
                {draft.published_at ? new Date(draft.published_at).toLocaleDateString("en-NG") : "Not published"}
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-[#eadfca] bg-white p-5 shadow-[0_18px_45px_rgba(33,25,12,0.05)]">
            <div className="flex items-center gap-2 text-[#c9a961]">
              <ImageIcon className="size-4" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em]">Media Library</p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {cmsMediaLibrary.map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setPageField("hero_image", src)}
                  className={cn(
                    "group relative aspect-[4/3] overflow-hidden rounded-lg border bg-[#151515]",
                    draft.hero_image === src ? "border-[#c9a961]" : "border-[#eadfca]"
                  )}
                  title={src}
                >
                  <Image src={src} alt="" fill sizes="160px" className="object-cover opacity-80 transition group-hover:opacity-100" />
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-[#756d5e]">
              Click an image to use it as this page hero. Section image fields can use the same paths.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Panel({ title, id, children }: { title: string; id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="rounded-lg border border-[#eadfca] bg-white p-5 shadow-[0_18px_45px_rgba(33,25,12,0.05)]">
      <h2 className="mb-5 text-lg font-semibold text-[#151515]">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-[#82796a]">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
          className="w-full rounded-lg border border-[#eadfca] bg-[#fffdf8] px-4 py-3 text-sm leading-relaxed text-[#151515] outline-none transition focus:border-[#c9a961]/70"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full rounded-lg border border-[#eadfca] bg-[#fffdf8] px-4 text-sm text-[#151515] outline-none transition focus:border-[#c9a961]/70"
        />
      )}
    </label>
  );
}
