"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll } from "motion/react";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { BrandLogo } from "@/components/public/brand-logo";

export function SiteHeader() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const unsub = scrollY.on("change", (y) => setScrolled(y > 80));
    return () => unsub();
  }, [scrollY]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "py-4 px-6 lg:px-15 bg-[rgba(23,24,26,0.95)] backdrop-blur-xl"
          : "py-6 px-6 lg:px-15 bg-transparent"
      )}
      style={{
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <div className="flex items-center justify-between">
        <Link href="/" aria-label="Hilton Euphoria Hotel — Home">
          <BrandLogo height={scrolled ? 36 : 44} invert />
        </Link>

        <DesktopNav pathname={pathname} />

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <button
                aria-label="Open menu"
                className="inline-flex lg:hidden size-10 items-center justify-center rounded-full border border-white/25 text-white hover:bg-white/10 transition-colors"
              >
                <Menu className="size-5" />
              </button>
            }
          />
          <SheetContent
            side="right"
            className="w-full max-w-sm bg-[var(--color-dark)] text-white border-l border-white/10 p-0"
          >
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SheetDescription className="sr-only">
              Browse the Hilton Euphoria Hotel website
            </SheetDescription>
            <MobileNav onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

function DesktopNav({ pathname }: { pathname: string }) {
  const reservation = siteConfig.nav.find((n) => false);
  void reservation;

  return (
    <nav className="hidden lg:flex items-center gap-9">
      {siteConfig.nav.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          label={item.label}
          active={pathname === item.href}
        />
      ))}
      <Link
        href="/rooms"
        className="inline-flex h-10 items-center justify-center px-7 text-[11px] font-semibold tracking-[3px] uppercase border border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-white transition-all"
      >
        Reserve
      </Link>
    </nav>
  );
}

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative text-[12px] font-medium tracking-[2px] uppercase text-white transition-opacity",
        active ? "opacity-100" : "opacity-85 hover:opacity-100"
      )}
    >
      {label}
    </Link>
  );
}

function MobileNav({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <BrandLogo height={40} invert />
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        {siteConfig.nav.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.05 + index * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Link
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "block px-4 py-3 font-heading text-2xl",
                pathname === item.href
                  ? "text-[var(--color-gold)]"
                  : "text-white hover:text-[var(--color-gold-light)]"
              )}
            >
              {item.label}
            </Link>
          </motion.div>
        ))}
      </nav>

      <div className="p-6 border-t border-white/10 space-y-3">
        <Link
          href="/rooms"
          onClick={onNavigate}
          className="flex h-12 items-center justify-center bg-[var(--color-gold)] text-white text-[11px] font-semibold tracking-[3px] uppercase hover:bg-[var(--color-dark)] transition-colors"
        >
          Reserve
        </Link>
      </div>
    </div>
  );
}
