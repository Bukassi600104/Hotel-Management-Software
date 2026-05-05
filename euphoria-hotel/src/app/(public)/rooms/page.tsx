import type { Metadata } from "next";

import { PageHero } from "@/components/public/page-hero";
import { AvailabilityChecker } from "@/components/public/availability-checker";
import { RoomCard } from "@/components/public/room-card";
import { StaggerGroup, StaggerItem, Reveal } from "@/components/motion/reveal";
import { getAllRooms, getAvailableRooms } from "@/lib/queries/rooms";
import { isValidDateString, calculateNights } from "@/lib/utils/dates";

export const metadata: Metadata = {
  title: "Rooms & Suites",
  description:
    "Nine considered rooms — from a Mini Standard to our flagship Presidential Apartment. Choose the stay that fits the trip.",
};

const heroImage = "/hotel-assets/room-deluxe-suite.png";

type SearchParams = Promise<{ checkin?: string; checkout?: string; adults?: string }>;

export default async function RoomsPage({ searchParams }: { searchParams: SearchParams }) {
  const { checkin, checkout, adults } = await searchParams;

  const hasSearch =
    checkin &&
    checkout &&
    isValidDateString(checkin) &&
    isValidDateString(checkout) &&
    calculateNights(checkin, checkout) >= 1;

  const rooms = hasSearch
    ? await getAvailableRooms(checkin!, checkout!, Number(adults ?? "1")).catch(() => getAllRooms())
    : await getAllRooms().catch(() => []);

  return (
    <>
      <PageHero
        eyebrow="Accommodation"
        title="Nine ways to settle in."
        description="Mini Standard to Presidential Apartment — every room is built around the same idea: pressed linen, soft light, considered service."
        image={heroImage}
        crumbs={[{ label: "Rooms" }]}
      />

      <section className="relative -mt-16 z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <AvailabilityChecker variant="card" />
        </div>
      </section>

      <section className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <Reveal variant="fade-up" className="mb-12 max-w-2xl">
            {hasSearch ? (
              <>
                <h2 className="font-heading text-3xl tracking-tight sm:text-4xl">
                  {rooms.length === 0
                    ? "No rooms available"
                    : `${rooms.length} room${rooms.length !== 1 ? "s" : ""} available`}
                </h2>
                <p className="mt-3 text-muted-foreground text-pretty">
                  {rooms.length === 0
                    ? "No rooms are available for those dates and guest count. Try adjusting your search."
                    : `Showing rooms available for your stay from ${checkin} to ${checkout}.`}
                </p>
              </>
            ) : (
              <>
                <h2 className="font-heading text-3xl tracking-tight sm:text-4xl">
                  The full collection
                </h2>
                <p className="mt-3 text-muted-foreground text-pretty">
                  All {rooms.length} room types, listed in increasing order of theatre. Click
                  through for full galleries, amenities, and live availability.
                </p>
              </>
            )}
          </Reveal>

          {rooms.length > 0 && (
            <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room, i) => (
                <StaggerItem key={room.slug}>
                  <RoomCard room={room} priority={i < 3} />
                </StaggerItem>
              ))}
            </StaggerGroup>
          )}
        </div>
      </section>
    </>
  );
}
