import { addDays, format } from "date-fns";
import { rooms } from "@/lib/data/rooms";
import { buildPricingBreakdown } from "@/lib/utils/pricing";
import { generateBookingReference } from "@/lib/utils/booking-reference";

export type DemoBooking = {
  id: string;
  booking_reference: string;
  booking_type: "online" | "reservation";
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  total_nights: number;
  price_per_night: number;
  subtotal: number;
  vat_amount: number;
  total_amount: number;
  num_adults: number;
  num_children: number;
  arrival_time: string | null;
  notes: string | null;
  internal_notes: string | null;
  paystack_reference: string | null;
  paid_at: string | null;
  status: string;
  created_at: string;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  rooms: { name: string; slug: string; thumbnail_url: string | null } | null;
};

type Store = {
  bookings: DemoBooking[];
};

const globalStore = globalThis as typeof globalThis & { __euphoriaDemoStore?: Store };

function todayPlus(days: number) {
  return format(addDays(new Date(), days), "yyyy-MM-dd");
}

function roomSummary(slug: string) {
  const room = rooms.find((item) => item.slug === slug) ?? rooms[0];
  return { room, rooms: { name: room.name, slug: room.slug, thumbnail_url: room.thumbnail } };
}

function makeBooking(
  slug: string,
  booking_type: "online" | "reservation",
  guest_name: string,
  guest_email: string,
  check_in_date: string,
  check_out_date: string
): DemoBooking {
  const { room, rooms: roomRelation } = roomSummary(slug);
  const total_nights = Math.max(
    1,
    Math.round(
      (new Date(check_out_date).getTime() - new Date(check_in_date).getTime()) / 86400000
    )
  );
  const pricing = buildPricingBreakdown(room.pricePerNight, total_nights);

  return {
    id: crypto.randomUUID(),
    booking_reference: generateBookingReference(),
    booking_type,
    guest_name,
    guest_email,
    guest_phone: "+234 806 026 0260",
    room_id: room.slug,
    check_in_date,
    check_out_date,
    total_nights,
    price_per_night: pricing.pricePerNight,
    subtotal: pricing.subtotal,
    vat_amount: pricing.vat,
    total_amount: pricing.total,
    num_adults: 1,
    num_children: 0,
    arrival_time: null,
    notes: null,
    internal_notes: null,
    paystack_reference: booking_type === "online" ? `DEMO-${Date.now()}` : null,
    paid_at: booking_type === "online" ? new Date().toISOString() : null,
    status: "confirmed",
    created_at: new Date().toISOString(),
    cancelled_at: null,
    cancellation_reason: null,
    rooms: roomRelation,
  };
}

export function demoStore(): Store {
  if (!globalStore.__euphoriaDemoStore) {
    globalStore.__euphoriaDemoStore = {
      bookings: [
        makeBooking("executive-suite", "online", "Adaeze Okafor", "adaeze@example.com", todayPlus(5), todayPlus(7)),
        makeBooking("deluxe", "reservation", "Tunde Williams", "tunde@example.com", todayPlus(8), todayPlus(10)),
      ],
    };
  }
  return globalStore.__euphoriaDemoStore;
}

export function createDemoBooking(input: {
  roomSlug: string;
  bookingType: "online" | "reservation";
  checkin: string;
  checkout: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  numAdults: number;
  numChildren: number;
  arrivalTime?: string;
  notes?: string;
}) {
  const { room, rooms: roomRelation } = roomSummary(input.roomSlug);
  const nights = Math.max(
    1,
    Math.round((new Date(input.checkout).getTime() - new Date(input.checkin).getTime()) / 86400000)
  );
  const pricing = buildPricingBreakdown(room.pricePerNight, nights);
  const booking: DemoBooking = {
    id: crypto.randomUUID(),
    booking_reference: generateBookingReference(),
    booking_type: input.bookingType,
    guest_name: `${input.firstName} ${input.lastName}`,
    guest_email: input.email.toLowerCase(),
    guest_phone: input.phone,
    room_id: room.slug,
    check_in_date: input.checkin,
    check_out_date: input.checkout,
    total_nights: nights,
    price_per_night: pricing.pricePerNight,
    subtotal: pricing.subtotal,
    vat_amount: pricing.vat,
    total_amount: pricing.total,
    num_adults: input.numAdults,
    num_children: input.numChildren,
    arrival_time: input.arrivalTime ?? null,
    notes: input.notes ?? null,
    internal_notes: null,
    paystack_reference: input.bookingType === "online" ? `DEMO-${Date.now()}` : null,
    paid_at: input.bookingType === "online" ? new Date().toISOString() : null,
    status: "confirmed",
    created_at: new Date().toISOString(),
    cancelled_at: null,
    cancellation_reason: null,
    rooms: roomRelation,
  };
  demoStore().bookings.unshift(booking);
  return booking;
}

export function listDemoBookings() {
  return demoStore().bookings;
}

export function findDemoBookingById(id: string) {
  return demoStore().bookings.find((booking) => booking.id === id);
}

export function findDemoBooking(reference: string, email?: string) {
  return demoStore().bookings.find(
    (booking) =>
      booking.booking_reference === reference.toUpperCase().trim() &&
      (!email || booking.guest_email === email.toLowerCase().trim())
  );
}

export function cancelDemoBooking(reference: string, email: string, reason?: string) {
  const booking = findDemoBooking(reference, email);
  if (!booking) return null;
  booking.status = "cancelled";
  booking.cancelled_at = new Date().toISOString();
  booking.cancellation_reason = reason ?? "Cancelled by guest";
  return booking;
}
