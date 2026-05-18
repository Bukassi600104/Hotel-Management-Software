"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, BookOpen, Menu, MessageSquare, Search } from "lucide-react";
import { AdminSidebar } from "@/components/admin/sidebar";

type Props = {
  adminName: string;
  adminRole: string;
  unreadCount?: number;
  children: React.ReactNode;
};

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/bookings": "Bookings",
  "/admin/calendar": "Calendar",
  "/admin/blocks": "Block Dates",
  "/admin/rooms": "Rooms",
  "/admin/inquiries": "Inquiries",
  "/admin/users": "Users",
  "/admin/settings": "Settings",
};

export function AdminShell({ adminName, adminRole, unreadCount = 0, children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const currentTitle =
    pageTitles[pathname] ??
    Object.entries(pageTitles).find(([href]) => pathname.startsWith(`${href}/`))?.[1] ??
    "Dashboard";

  function handleSearch(e?: { preventDefault: () => void }) {
    e?.preventDefault();
    const query = search.trim();
    if (!query) {
      router.push("/admin/bookings");
      return;
    }
    router.push(`/admin/bookings?search=${encodeURIComponent(query)}`);
  }

  return (
    <div className="min-h-screen bg-[#101113] text-white">
      <div className="flex min-h-screen">
        <AdminSidebar
          adminName={adminName}
          adminRole={adminRole}
          unreadCount={unreadCount}
          mobileOpen={mobileOpen}
          onMobileOpenChange={setMobileOpen}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/8 bg-[#101113]/92 px-4 py-3 backdrop-blur-xl lg:px-7">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-white/65 transition hover:border-[#c9a961]/40 hover:text-[#c9a961] lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-4" />
              </button>

              <div className="hidden min-w-[150px] lg:block">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#c9a961]/70">Booking App</p>
                <p className="mt-1 text-sm font-semibold text-white/85">{currentTitle}</p>
              </div>

              <form onSubmit={handleSearch} className="relative min-w-0 flex-1 lg:max-w-xl">
                <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/32" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch(e);
                    }
                  }}
                  placeholder="Search rooms, bookings, guests..."
                  className="h-11 w-full rounded-2xl border border-white/10 bg-white/[0.035] pl-11 pr-4 text-sm text-white shadow-[0_18px_50px_rgba(0,0,0,0.12)] outline-none transition placeholder:text-white/28 focus:border-[#c9a961]/45 focus:bg-white/[0.055] focus:ring-2 focus:ring-[#c9a961]/10"
                />
              </form>

              <div className="flex items-center gap-2">
                <Link
                  href="/admin/bookings?status=pending"
                  className="relative hidden size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-white/60 transition hover:border-[#c9a961]/35 hover:text-[#c9a961] sm:grid"
                  aria-label="Pending bookings"
                >
                  <Bell className="size-4" />
                </Link>
                <Link
                  href="/admin/inquiries"
                  className="relative grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-white/60 transition hover:border-[#c9a961]/35 hover:text-[#c9a961]"
                  aria-label="Unread inquiries"
                >
                  <MessageSquare className="size-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-[#c9a961] text-[10px] font-bold text-[#17181a]">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/admin/bookings"
                  className="hidden items-center gap-2 rounded-2xl bg-[#c9a961] px-4 py-2.5 text-xs font-semibold text-[#17181a] transition hover:bg-[#d4bc96] md:flex"
                >
                  <BookOpen className="size-4" />
                  Bookings
                </Link>
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1 overflow-x-hidden bg-[radial-gradient(circle_at_top_right,rgba(201,169,97,0.08),transparent_32%),#101113]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
