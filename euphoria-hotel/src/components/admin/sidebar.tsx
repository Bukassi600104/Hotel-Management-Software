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
  X,
  Crown,
  UserRound,
} from "lucide-react";
import { BrandLogo } from "@/components/public/brand-logo";
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
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
};

export function AdminSidebar({
  adminName,
  adminRole,
  unreadCount = 0,
  mobileOpen = false,
  onMobileOpenChange,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

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
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="min-w-0">
          <BrandLogo height={36} />
          <p className="sr-only">Hilton Euphoria</p>
          <p className="mt-0.5 text-[11px] text-[#6f6757]">Hotel operations</p>
        </div>
        <button
          type="button"
          onClick={() => onMobileOpenChange?.(false)}
          className="ml-auto grid size-8 place-items-center rounded-lg text-[#756d5e] hover:bg-[#f7f1e6] hover:text-[#151515] lg:hidden"
          aria-label="Close menu"
        >
          <X className="size-4" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
        {navItems.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            onClick={() => onMobileOpenChange?.(false)}
            className={cn(
              "group flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm transition-all",
              isActive(href, exact)
                ? "bg-[#c9a961]/16 text-[#8b6b24] shadow-[inset_0_0_0_1px_rgba(201,169,97,0.18)]"
                : "text-[#6b6252] hover:bg-[#f7f1e6] hover:text-[#151515]"
            )}
          >
            <span
              className={cn(
                "grid size-8 shrink-0 place-items-center rounded-xl transition",
                isActive(href, exact) ? "bg-[#c9a961]/18" : "bg-[#f7f1e6] group-hover:bg-[#efe4d2]"
              )}
            >
              <Icon className="size-4" />
            </span>
            <span className="truncate">{label}</span>
            {label === "Inquiries" && unreadCount > 0 && (
              <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-[#c9a961] text-[10px] font-bold text-[#17181a]">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="mx-4 mb-4 rounded-2xl border border-[#c9a961]/25 bg-[#fbf6eb] p-4 shadow-[0_18px_55px_rgba(33,25,12,0.06)]">
        <div className="grid size-9 place-items-center rounded-xl bg-[#c9a961]/18 text-[#c9a961]">
          <Crown className="size-4" />
        </div>
        <p className="mt-3 text-sm font-semibold text-[#151515]">Operations center</p>
        <p className="mt-1 text-xs leading-5 text-[#6f6757]">Live booking tools and hotel management controls.</p>
        <Link
          href="/admin/settings"
          onClick={() => onMobileOpenChange?.(false)}
          className="mt-4 inline-flex items-center rounded-xl bg-[#c9a961] px-3 py-2 text-xs font-semibold text-[#17181a] transition hover:bg-[#d4bc96]"
        >
          Tune settings
        </Link>
      </div>

      <div className="border-t border-[#eadfca] px-4 py-4">
        <div className="mb-3 flex items-center gap-3 rounded-2xl bg-[#fbfaf7] px-3 py-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-[#c9a961]/18 text-[#8b6b24]">
            <UserRound className="size-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-[#151515]">{adminName}</p>
            <p className="text-[10px] capitalize text-[#756d5e]">{adminRole.replace("_", " ")}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#756d5e] transition-colors hover:bg-[#f7f1e6] hover:text-[#151515]"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-[#eadfca] bg-white lg:block">
        {content}
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/45 lg:hidden"
          onClick={() => onMobileOpenChange?.(false)}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 border-r border-[#eadfca] bg-white transition-transform lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {content}
      </aside>
    </>
  );
}
