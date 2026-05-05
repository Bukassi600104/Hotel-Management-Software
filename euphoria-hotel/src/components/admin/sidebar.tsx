"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Ban,
  BedDouble,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/bookings", label: "Bookings", icon: BookOpen },
  { href: "/admin/calendar", label: "Calendar", icon: Calendar },
  { href: "/admin/blocks", label: "Block Dates", icon: Ban },
  { href: "/admin/rooms", label: "Rooms", icon: BedDouble },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

type Props = {
  adminName: string;
  adminRole: string;
  unreadCount?: number;
};

export function AdminSidebar({ adminName, adminRole, unreadCount = 0 }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  const content = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="border-b border-white/8 px-6 py-5">
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#c9a961]">Hilton Euphoria</p>
        <p className="mt-0.5 text-[10px] text-white/40">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {navItems.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
              isActive(href, exact)
                ? "bg-[#c9a961]/15 text-[#c9a961]"
                : "text-white/55 hover:bg-white/5 hover:text-white/90"
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span>{label}</span>
            {label === "Inquiries" && unreadCount > 0 && (
              <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-[#c9a961] text-[10px] font-bold text-[#17181a]">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/8 px-4 py-4">
        <div className="mb-3 flex items-center gap-3 px-2">
          <div className="grid size-8 shrink-0 place-items-center rounded-full bg-[#c9a961]/20 text-xs font-semibold text-[#c9a961]">
            {adminName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-white/80">{adminName}</p>
            <p className="text-[10px] capitalize text-white/40">{adminRole.replace("_", " ")}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-white/8 bg-[#0f1012] lg:block">
        {content}
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-white/8 bg-[#0f1012] px-4 py-3 lg:hidden">
        <p className="text-[11px] uppercase tracking-[0.35em] text-[#c9a961]">Euphoria Admin</p>
        <button
          onClick={() => setOpen(!open)}
          className="text-white/60 hover:text-white"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r border-white/8 bg-[#0f1012] transition-transform lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {content}
      </aside>
    </>
  );
}
