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
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Props = {
  adminName: string;
  adminRole: string;
  children: React.ReactNode;
};

const links = [
  { label: "Command Center", href: "/cms", icon: LayoutDashboard },
  { label: "Homepage", href: "/cms/pages/home", icon: Home },
  { label: "About Page", href: "/cms/pages/about", icon: FileText },
  { label: "Conference Page", href: "/cms/pages/conference", icon: FileText },
  { label: "Menu Page", href: "/cms/pages/menu", icon: FileText },
  { label: "Contact Page", href: "/cms/pages/contact", icon: FileText },
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
    <aside className="flex h-full w-[292px] flex-col border-r border-white/10 bg-[#0b0c0e] p-5">
      <Link href="/cms" className="flex items-center gap-3">
        <div className="grid size-12 place-items-center rounded-lg bg-[#c9a961] text-lg font-black text-[#111214]">
          H
        </div>
        <div>
          <p className="font-semibold text-white">Hilton Euphoria</p>
          <p className="text-xs text-white/42">Website CMS</p>
        </div>
      </Link>

      <div className="mt-7 rounded-lg border border-[#c9a961]/18 bg-[#c9a961]/8 p-4">
        <div className="flex items-center gap-2 text-[#c9a961]">
          <ShieldCheck className="size-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.18em]">Safe editing</span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-white/55">
          Fixed content fields only. Layouts, booking logic, and room operations stay protected.
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
                  ? "bg-[#c9a961]/14 text-[#c9a961]"
                  : "text-white/58 hover:bg-white/[0.04] hover:text-white"
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
          className="flex items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/70 transition hover:border-[#c9a961]/50 hover:text-[#c9a961]"
        >
          <Eye className="size-4" />
          Preview Site
        </Link>
        <Link
          href="/admin"
          className="flex items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/70 transition hover:border-[#c9a961]/50 hover:text-[#c9a961]"
        >
          <Settings className="size-4" />
          Booking Admin
        </Link>
        <div className="rounded-lg border border-white/8 bg-white/[0.03] p-4">
          <p className="text-sm font-semibold text-white">{adminName}</p>
          <p className="mt-1 text-xs capitalize text-white/42">{adminRole.replace("_", " ")}</p>
          <button
            onClick={signOut}
            className="mt-3 flex items-center gap-2 text-xs text-white/45 transition hover:text-[#c9a961]"
          >
            <LogOut className="size-3.5" />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#101113] text-white">
      <div className="lg:hidden">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[#101113]/95 px-4 py-3 backdrop-blur">
          <button
            onClick={() => setOpen(true)}
            className="grid size-10 place-items-center rounded-lg border border-white/10"
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
          <div className="fixed inset-0 z-50 bg-black/70" onClick={() => setOpen(false)}>
            <div className="h-full" onClick={(event) => event.stopPropagation()}>
              {sidebar}
            </div>
          </div>
        )}
      </div>

      <div className="flex min-h-screen">
        <div className="hidden lg:block">{sidebar}</div>
        <main className="min-w-0 flex-1 bg-[radial-gradient(circle_at_top_right,rgba(201,169,97,0.10),transparent_34%),#101113]">
          {children}
        </main>
      </div>
    </div>
  );
}
