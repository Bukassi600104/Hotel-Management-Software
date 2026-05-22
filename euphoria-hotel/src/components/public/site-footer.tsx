import Link from "next/link";

import { BrandLogo } from "@/components/public/brand-logo";
import { getCmsFooter } from "@/lib/cms/content";

export async function SiteFooter() {
  const footer = await getCmsFooter();
  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Rooms", href: "/rooms" },
    { label: "About Us", href: "/about" },
    { label: "Conference Room", href: "/conference" },
    { label: "Hotel Menu", href: "/menu" },
    { label: "Guest Guide", href: "/guest-guide" },
    { label: "Laundry Service", href: "/laundry" },
    { label: "Contact Us", href: "/contact" },
  ];

  return (
    <footer className="bg-[var(--color-dark)] text-white/70 px-6 lg:px-15 py-20 pb-10">
      <div className="mx-auto max-w-[1300px]">
        <div className="grid gap-15 mb-15 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:gap-15">
          <div>
            <div className="mb-5">
              <BrandLogo height={50} invert />
            </div>
            <p className="text-sm leading-[1.7] max-w-xs text-white/70">
              {footer.description}
            </p>
          </div>

          <FooterCol title="Quick Links">
            <div className="flex flex-col gap-3 text-sm">
              {quickLinks.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="hover:text-[var(--color-gold)] transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </FooterCol>

          <FooterCol title="Contact">
            <div className="flex flex-col gap-3 text-sm">
              <a
                href={`tel:${footer.reservationPhone.replace(/\s/g, "")}`}
                className="hover:text-[var(--color-gold)] transition-colors"
              >
                {footer.reservationPhone}
              </a>
              <a
                href={`tel:${footer.frontDeskPhone.replace(/\s/g, "")}`}
                className="hover:text-[var(--color-gold)] transition-colors"
              >
                {footer.frontDeskPhone}
              </a>
              <a
                href={`mailto:${footer.email}`}
                className="hover:text-[var(--color-gold)] transition-colors"
              >
                {footer.email}
              </a>
            </div>
          </FooterCol>

          <FooterCol title="Address">
            <p className="text-sm leading-[1.7]">
              {footer.address}
            </p>
          </FooterCol>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center text-[13px]">
          <span>
            Copyright {new Date().getFullYear()} Hilton Euphoria Hotel. All rights reserved.
          </span>
          <div className="flex flex-wrap gap-5">
            {footer.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="text-[12px] font-medium tracking-[1px] hover:text-[var(--color-gold)] transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="text-[11px] font-semibold tracking-[3px] uppercase text-[var(--color-gold)] mb-5">
        {title}
      </h4>
      {children}
    </div>
  );
}
