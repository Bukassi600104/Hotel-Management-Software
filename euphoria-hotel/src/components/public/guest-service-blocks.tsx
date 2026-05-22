import Link from "next/link";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

export type CatalogItem = {
  name: string;
  price?: string;
  note?: string;
};

export type CatalogSection = {
  title: string;
  items: CatalogItem[];
};

export type LaundryItem = {
  item: string;
  washing: string;
  ironing: string;
};

export function parseCatalogText(value: string): CatalogSection[] {
  const sections: CatalogSection[] = [];
  let current: CatalogSection | null = null;

  for (const rawLine of value.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith("## ")) {
      current = { title: line.replace(/^##\s+/, ""), items: [] };
      sections.push(current);
      continue;
    }

    if (!current) {
      current = { title: "Menu", items: [] };
      sections.push(current);
    }

    const priced = line.match(/^(.+?)\s+-\s+([\d,]+)$/);
    if (priced) {
      current.items.push({ name: priced[1], price: priced[2] });
      continue;
    }

    const previous = current.items.at(-1);
    if (previous && !previous.note) {
      previous.note = line;
    } else {
      current.items.push({ name: line });
    }
  }

  return sections;
}

export function parsePipeRows(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split("|").map((part) => part.trim()));
}

export function parseLaundryText(value: string): LaundryItem[] {
  return parsePipeRows(value)
    .filter((row) => row.length >= 3)
    .map(([item, washing, ironing]) => ({ item, washing, ironing }));
}

export function parseLabelValueText(value: string) {
  return parsePipeRows(value)
    .filter((row) => row.length >= 2)
    .map(([label, details]) => ({ label, details }));
}

export function ServiceLinkCards({
  links,
}: {
  links: Array<{
    title: string;
    body: string;
    href: string;
    icon: LucideIcon;
  }>;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className="group border border-[#e8dfd1] bg-[#fffdf8] p-6 transition-all hover:-translate-y-1 hover:border-[var(--color-gold)] hover:shadow-[0_24px_70px_-42px_rgba(23,24,26,0.45)]"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="grid size-12 place-items-center border border-[var(--color-gold)] text-[var(--color-gold-dark)]">
                <Icon className="size-5" strokeWidth={1.6} />
              </span>
              <ArrowUpRight className="size-4 text-[var(--color-gold)] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
            <h3 className="mt-5 font-heading text-2xl tracking-tight text-[var(--color-dark)]">
              {link.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-light)]">
              {link.body}
            </p>
          </Link>
        );
      })}
    </div>
  );
}

export function CatalogGrid({
  sections,
  images = {},
}: {
  sections: CatalogSection[];
  images?: Record<string, string>;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {sections.map((section) => (
        <article key={section.title} className="border border-[#e8dfd1] bg-[#fffdf8] p-6">
          {images[section.title] && (
            <div className="-mx-6 -mt-6 mb-6 aspect-[16/10] overflow-hidden bg-[var(--color-cream)]">
              <Image
                src={images[section.title]}
                alt={`${section.title} at Hilton Euphoria Hotel`}
                width={700}
                height={438}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <h3 className="font-heading text-2xl text-[var(--color-dark)]">{section.title}</h3>
          <div className="mt-5 space-y-4">
            {section.items.map((item, index) => (
              <div key={`${item.name}-${index}`} className="border-b border-[#ede5da] pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--color-dark)]">
                    {item.name}
                  </p>
                  {item.price && (
                    <p className="shrink-0 font-heading text-xl tabular-nums text-[var(--color-gold-dark)]">
                      N{item.price}
                    </p>
                  )}
                </div>
                {item.note && <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-light)]">{item.note}</p>}
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
