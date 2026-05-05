import Link from "next/link";

import { RoomCard } from "@/components/public/room-card";
import type { Room } from "@/types";

type Props = {
  rooms: Room[];
};

export function HomeRoomsGrid({ rooms }: Props) {
  return (
    <section id="rooms" className="px-6 py-[60px] md:px-15 md:py-[100px] bg-[var(--color-white-warm)]">
      <div className="mx-auto max-w-[1300px]">
        <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label-tag mb-4">Our Accomodation</p>
            <h2 className="heading-lg">Our Accomodation</h2>
          </div>
          <Link
            href="/rooms"
            className="inline-flex h-11 w-fit items-center justify-center border border-[var(--color-gold)] px-7 text-[11px] font-semibold uppercase tracking-[3px] text-[var(--color-gold)] transition-colors hover:bg-[var(--color-gold)] hover:text-white"
          >
            View All Rooms
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room, index) => (
            <RoomCard key={room.slug} room={room} priority={index < 3} />
          ))}
        </div>
      </div>
    </section>
  );
}
