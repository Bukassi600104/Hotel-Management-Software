"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Eye,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { BrandLogo } from "@/components/public/brand-logo";
import { createClient } from "@/lib/supabase/client";
import { editablePages } from "@/lib/cms/defaults";
import { cn } from "@/lib/utils";

type Props = {
  adminName: string;
  adminRole: string;
  children: React.ReactNode;
};

const links = [
  { label: "Command Center", href: "/cms", icon: LayoutDashboard },
  ...editablePages.map((page) => ({
    label: page.label,
    href: `/cms/pages/${page.slug}`,
    icon: page.slug === "home" ? Home : FileText,
  })),
];

export function CmsShell({ adminName, adminRole, children }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/admin/login?next=/cms";
  }

  const sidebar = (
    <aside className="flex h-full w-[292px] flex-col border-r border-[#eadfca] bg-white p-5 shadow-[18px_0_50px_rgba(31,24,10,0.04)]">
      <Link href="/cms" className="flex items-center gap-3">
        <div className="flex h-12 w-28 items-center rounded-lg">
          <BrandLogo height={38} />
        </div>
        <div>
          <p className="sr-only">Hilton Euphoria</p>
          <p className="text-xs text-[#6f6757]">Website CMS</p>
        </div>
      </Link>

      <div className="mt-7 rounded-lg border border-[#c9a961]/25 bg-[#fbf6eb] p-4">
        <div className="flex items-center gap-2 text-[#c9a961]">
          <ShieldCheck className="size-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.18em]">Safe editing</span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-[#6f6757]">
          Guided content fields keep page layouts, booking logic, and room operations consistent.
        </p>
      </div>

      <nav className="mt-7 space-y-1">
        {links.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition",
                active
                  ? "bg-[#c9a961]/15 text-[#8b6b24]"
                  : "text-[#6b6252] hover:bg-[#f7f1e6] hover:text-[#151515]"
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-center gap-2 rounded-lg border border-[#eadfca] bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#5f5748] transition hover:border-[#c9a961]/55 hover:text-[#8b6b24]"
        >
          <Eye className="size-4" />
          Preview Site
        </Link>
        <Link
          href="/admin"
          className="flex items-center justify-center gap-2 rounded-lg border border-[#eadfca] bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#5f5748] transition hover:border-[#c9a961]/55 hover:text-[#8b6b24]"
        >
          <Settings className="size-4" />
          Booking Admin
        </Link>
        <div className="rounded-lg border border-[#eadfca] bg-[#fbfaf7] p-4">
          <p className="text-sm font-semibold text-[#151515]">{adminName}</p>
          <p className="mt-1 text-xs capitalize text-[#736a5a]">{adminRole.replace("_", " ")}</p>
          <button
            onClick={signOut}
            className="mt-3 flex items-center gap-2 text-xs text-[#756d5e] transition hover:text-[#8b6b24]"
          >
            <LogOut className="size-3.5" />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#f7f3eb] text-[#151515]">
      <div className="lg:hidden">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[#eadfca] bg-white/95 px-4 py-3 backdrop-blur">
          <button
            onClick={() => setOpen(true)}
            className="grid size-10 place-items-center rounded-lg border border-[#eadfca] text-[#151515]"
            aria-label="Open CMS menu"
          >
            <Menu className="size-4" />
          </button>
          <span className="text-sm font-semibold">Website CMS</span>
          <Link href="/" target="_blank" className="text-xs text-[#c9a961]">
            Preview
          </Link>
        </header>
        {open && (
          <div className="fixed inset-0 z-50 bg-black/45" onClick={() => setOpen(false)}>
            <div className="h-full" onClick={(event) => event.stopPropagation()}>
              {sidebar}
            </div>
          </div>
        )}
      </div>

      <div className="flex min-h-screen">
        <div className="hidden lg:block">{sidebar}</div>
        <main className="min-w-0 flex-1 bg-[radial-gradient(circle_at_top_right,rgba(201,169,97,0.20),transparent_30%),linear-gradient(180deg,#fffdf8_0%,#f6efe2_100%)]">
          {children}
        </main>
      </div>
    </div>
  );
}
