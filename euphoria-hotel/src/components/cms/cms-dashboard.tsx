import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Clock3, FileText, Image, PanelTop, Pencil, Send } from "lucide-react";
import { editablePages, type CmsFooterSettings, type CmsPage } from "@/lib/cms/defaults";

type Props = {
  pages: CmsPage[];
  footer: CmsFooterSettings;
};

export function CmsDashboard({ pages, footer }: Props) {
  const published = pages.filter((page) => page.status === "published").length;
  const drafts = pages.filter((page) => page.status === "draft").length;
  const lastUpdated = [...pages]
    .filter((page) => page.updated_at)
    .sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at)))[0]?.updated_at;

  const actions = [
    { label: "Edit Homepage", href: "/cms/pages/home", icon: PanelTop, note: "Hero, intro, CTA and homepage copy" },
    { label: "Change Hero Images", href: "/cms/pages/home#hero", icon: Image, note: "Safe image paths from the hotel media library" },
    { label: "Update Contact Info", href: "/cms/pages/contact#footer", icon: Pencil, note: "Phones, email, address and social links" },
    { label: "Preview Website", href: "/", icon: ArrowUpRight, note: "Open the live public website" },
  ];

  return (
    <div className="px-5 py-8 lg:px-9 lg:py-10">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.42em] text-[#c9a961]">Website Manager</p>
          <h1 className="mt-3 font-heading text-4xl tracking-tight text-white lg:text-5xl">
            Client CMS Command Center
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55">
            Update website text, images, footer details, and SEO from safe fields. The booking system
            remains separate and protected.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#c9a961] px-5 text-xs font-bold uppercase tracking-[0.16em] text-[#151515]"
        >
          Preview Site
          <ArrowUpRight className="size-4" />
        </Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Stat label="Published pages" value={published} />
        <Stat label="Draft edits" value={drafts} />
        <Stat label="Media assets" value="12" />
        <Stat label="Footer email" value={footer.email} compact />
      </div>

      <section className="mt-8 grid gap-4 lg:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              target={action.href === "/" ? "_blank" : undefined}
              className="group rounded-lg border border-white/10 bg-white/[0.035] p-5 transition hover:-translate-y-0.5 hover:border-[#c9a961]/45 hover:bg-white/[0.055]"
            >
              <div className="grid size-11 place-items-center rounded-lg bg-[#c9a961]/13 text-[#c9a961]">
                <Icon className="size-5" />
              </div>
              <h2 className="mt-5 text-base font-semibold text-white">{action.label}</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/48">{action.note}</p>
            </Link>
          );
        })}
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-lg border border-white/10 bg-white/[0.035]">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold">Website pages</h2>
              <p className="text-sm text-white/42">Safe field editing for public website pages.</p>
            </div>
            <FileText className="size-5 text-[#c9a961]" />
          </div>
          <div className="divide-y divide-white/8">
            {editablePages.map((item) => {
              const page = pages.find((candidate) => candidate.slug === item.slug);
              return (
                <div key={item.slug} className="grid gap-4 px-5 py-4 md:grid-cols-[1fr_auto_auto] md:items-center">
                  <div>
                    <p className="font-medium text-white">{item.label}</p>
                    <p className="mt-1 text-sm text-white/42">{page?.hero_title}</p>
                  </div>
                  <span className="w-fit rounded-full border border-[#c9a961]/25 bg-[#c9a961]/10 px-3 py-1 text-xs capitalize text-[#c9a961]">
                    {page?.status ?? "published"}
                  </span>
                  <div className="flex gap-2">
                    <Link href={item.href} target="_blank" className="rounded-lg border border-white/10 px-3 py-2 text-xs text-white/58 hover:text-white">
                      View
                    </Link>
                    <Link href={`/cms/pages/${item.slug}`} className="rounded-lg bg-white/8 px-3 py-2 text-xs text-white hover:bg-[#c9a961] hover:text-[#151515]">
                      Edit
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-5 text-[#c9a961]" />
              <h2 className="font-semibold">Content checklist</h2>
            </div>
            <ul className="mt-5 space-y-3 text-sm text-white/58">
              <li>Hero headings and images are editable.</li>
              <li>Footer contact details are editable.</li>
              <li>SEO title and description are editable.</li>
              <li>Room and booking controls stay in `/admin`.</li>
            </ul>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
            <div className="flex items-center gap-3">
              <Clock3 className="size-5 text-[#c9a961]" />
              <h2 className="font-semibold">Recent activity</h2>
            </div>
            <p className="mt-4 text-sm text-white/50">
              Last content update: {lastUpdated ? new Date(lastUpdated).toLocaleString("en-NG") : "No edits yet"}.
            </p>
          </div>
          <div className="rounded-lg border border-[#c9a961]/20 bg-[#c9a961]/8 p-5">
            <div className="flex items-center gap-3 text-[#c9a961]">
              <Send className="size-5" />
              <h2 className="font-semibold">Publishing rule</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/58">
              Changes update existing website sections only. The client cannot move layouts or damage the booking engine.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, compact }: { label: string; value: string | number; compact?: boolean }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-white/38">{label}</p>
      <p className={`mt-3 font-heading text-white ${compact ? "break-all text-lg" : "text-3xl"}`}>{value}</p>
    </div>
  );
}
