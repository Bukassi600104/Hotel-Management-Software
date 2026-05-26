import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bed, Users, Maximize2, Check, ArrowUpRight } from "lucide-react";

import { RoomGallery } from "@/components/public/room-gallery";
import { RoomCard } from "@/components/public/room-card";
import { RoomBookingSidebar } from "@/components/public/room-booking-sidebar";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/seo/json-ld";

import { getAllRooms, getRoomBySlug } from "@/lib/queries/rooms";
import { siteConfig } from "@/lib/site";
import { absoluteUrl, buildBreadcrumbJsonLd, buildRoomJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  const rooms = await getAllRooms().catch(() => []);
  return rooms.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params;
  const room = await getRoomBySlug(slug);
  if (!room) return { title: "Room not found" };
  const title = `${room.name} Room in Egbeda, Lagos`;
  const description = `${room.tagline} ${room.description}`;
  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(`/rooms/${room.slug}`),
    },
    openGraph: {
      type: "website",
      url: absoluteUrl(`/rooms/${room.slug}`),
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: absoluteUrl(room.thumbnail),
          width: 1200,
          height: 630,
          alt: `${room.name} at ${siteConfig.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(room.thumbnail)],
    },
  };
}

export default async function RoomDetailPage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;
  const [room, allRooms] = await Promise.all([getRoomBySlug(slug), getAllRooms().catch(() => [])]);
  if (!room) notFound();

  const related = allRooms.filter((r) => r.slug !== room.slug).slice(0, 3);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Rooms", path: "/rooms" },
    { name: room.name, path: `/rooms/${room.slug}` },
  ]);

  return (
    <>
      <JsonLd data={[buildRoomJsonLd(room), breadcrumbJsonLd]} />
      <article className="relative pb-24">
        {/* Hero / breadcrumb */}
        <div className="relative overflow-hidden bg-[var(--color-charcoal)] pb-18 pt-32 text-white">
          <Image
            src={room.thumbnail}
            alt=""
            fill
            preload
            fetchPriority="high"
            quality={75}
            sizes="100vw"
            className="object-cover opacity-42"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-charcoal)]/70 via-[var(--color-charcoal)]/58 to-[var(--color-charcoal)]" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <Reveal
              variant="fade-up"
              className="flex flex-wrap items-end justify-between gap-6"
            >
              <div className="max-w-2xl">
                <nav
                  aria-label="Breadcrumb"
                  className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.32em] text-white/55"
                >
                  <Link href="/" className="hover:text-white">
                    Home
                  </Link>
                  <span className="text-white/30">/</span>
                  <Link href="/rooms" className="hover:text-white">
                    Rooms
                  </Link>
                  <span className="text-white/30">/</span>
                  <span className="text-[var(--color-gold-light)]">
                    {room.shortName}
                  </span>
                </nav>
                {room.badge && (
                  <Badge className="mt-5 bg-[var(--color-gold)]/15 text-[var(--color-gold-light)] hover:bg-[var(--color-gold)]/20">
                    {room.badge}
                  </Badge>
                )}
                <h1 className="mt-4 font-heading text-5xl leading-[1.05] tracking-tight text-balance sm:text-6xl">
                  {room.name}
                </h1>
                <p className="mt-3 max-w-xl text-base text-white/75 sm:text-lg italic">
                  {room.tagline}
                </p>
              </div>
              <div className="border border-white/15 bg-black/25 p-5 backdrop-blur-md">
                <div className="mb-4 text-[10px] uppercase tracking-[0.32em] text-[var(--color-gold-light)]">
                  Room profile
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/80">
                  <Spec icon={Bed} label={room.bedType} />
                  <Spec icon={Users} label={`${room.maxGuests} guests`} />
                  <Spec icon={Maximize2} label={`${room.roomSizeSqm} m2`} />
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mx-auto -mt-12 max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-10 xl:gap-14">
            <div>
              <RoomGallery images={room.gallery} alt={room.name} />

              <Reveal
                variant="fade-up"
                className="mt-14 max-w-3xl space-y-5 text-base leading-relaxed text-foreground/85"
              >
                <h2 className="font-heading text-3xl tracking-tight sm:text-4xl">
                  About this room
                </h2>
                <p className="first-letter:font-heading first-letter:text-6xl first-letter:float-left first-letter:mr-2 first-letter:leading-[0.85] first-letter:text-[var(--color-gold-dark)]">
                  {room.description}
                </p>
                <p className="text-muted-foreground">
                  Every stay includes 24-hour reception, daily housekeeping,
                  high-speed Wi-Fi throughout the building, complimentary
                  espresso for in-room machines, and access to all hotel
                  facilities — pool, fitness studio, and rooftop lounge.
                </p>
              </Reveal>

              <div className="mt-14">
                <h2 className="font-heading text-3xl tracking-tight sm:text-4xl">
                  Amenities
                </h2>
                <p className="mt-2 max-w-md text-muted-foreground">
                  The full kit, with everything tested before you arrive.
                </p>
                <StaggerGroup className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {room.amenities.map((a) => (
                    <StaggerItem
                      key={a}
                      className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4"
                    >
                      <div className="grid size-9 place-items-center rounded-lg bg-[var(--color-gold)]/12 text-[var(--color-gold-dark)]">
                        <Check className="size-4" />
                      </div>
                      <span className="text-sm font-medium">{a}</span>
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </div>
            </div>

            {/* Sticky booking sidebar */}
            <RoomBookingSidebar
              roomSlug={room.slug}
              pricePerNight={room.pricePerNight}
              checkIn={siteConfig.hours.checkIn}
              checkOut={siteConfig.hours.checkOut}
              reception={siteConfig.hours.reception}
              phoneNumber={siteConfig.contact.phones[0].number}
            />
          </div>
        </div>

        {/* Related rooms */}
        <section className="mt-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <Reveal
              variant="fade-up"
              className="flex flex-wrap items-end justify-between gap-4"
            >
              <h2 className="font-heading text-3xl tracking-tight sm:text-4xl">
                You may also like
              </h2>
              <Link
                href="/rooms"
                className="inline-flex items-center gap-1 text-sm uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors"
              >
                All rooms
                <ArrowUpRight className="size-4" />
              </Link>
            </Reveal>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <RoomCard key={r.slug} room={r} />
              ))}
            </div>
          </div>
        </section>
      </article>
    </>
  );
}

function Spec({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <Icon className="size-4 text-[var(--color-gold-light)]" />
      {label}
    </span>
  );
}

