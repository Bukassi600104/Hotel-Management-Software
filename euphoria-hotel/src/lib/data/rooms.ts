import type { Room } from "@/types";

const BASE = "/hotel-assets";

export const rooms: Room[] = [
  {
    slug: "mini-standard",
    name: "Mini Standard",
    shortName: "Mini Standard",
    pricePerNight: 30000,
    maxGuests: 2,
    bedType: "1 Full Size Bed",
    roomSizeSqm: 22,
    tagline: "A composed retreat for the considered traveller.",
    description:
      "A neatly curated room dressed in warm neutrals, with everything you need for an effortless overnight in Lagos.",
    amenities: ["Free Wi-Fi", "Air Conditioning", "Smart TV", "Daily Housekeeping", "Workspace"],
    thumbnail: `${BASE}/room-mini-standard.png`,
    gallery: [
      `${BASE}/room-mini-standard.png`,
      `${BASE}/room-standard.png`,
      `${BASE}/room-deluxe.jpg`,
    ],
    displayOrder: 1,
  },
  {
    slug: "standard",
    name: "Standard",
    shortName: "Standard",
    pricePerNight: 40000,
    maxGuests: 2,
    bedType: "1 Full Size Bed",
    roomSizeSqm: 26,
    tagline: "Soft linens, soft light, and a soft landing.",
    description:
      "Our signature Standard balances generous proportion with quiet refinement — ideal for short stays that still deserve a touch of ceremony.",
    amenities: ["Free Wi-Fi", "Air Conditioning", "Smart TV", "Mini Bar", "Daily Housekeeping", "En-suite Bathroom"],
    thumbnail: `${BASE}/room-standard.png`,
    gallery: [
      `${BASE}/room-standard.png`,
      `${BASE}/room-mini-standard.png`,
      `${BASE}/room-deluxe.jpg`,
    ],
    displayOrder: 2,
  },
  {
    slug: "deluxe",
    name: "Deluxe",
    shortName: "Deluxe",
    pricePerNight: 50000,
    maxGuests: 2,
    bedType: "1 King Bed",
    roomSizeSqm: 32,
    tagline: "King-size comfort, dressed for evenings in.",
    description:
      "Step up to a king bed, hand-finished joinery, and a bathroom that takes its time.",
    amenities: ["King Bed", "Free Wi-Fi", "Smart TV", "Rain Shower", "Mini Bar", "Workspace"],
    thumbnail: `${BASE}/room-deluxe.jpg`,
    gallery: [
      `${BASE}/room-deluxe.jpg`,
      `${BASE}/room-super-deluxe.jpg`,
      `${BASE}/room-executive.png`,
    ],
    badge: "Popular",
    displayOrder: 3,
  },
  {
    slug: "super-deluxe",
    name: "Super Deluxe",
    shortName: "Super Deluxe",
    pricePerNight: 55000,
    maxGuests: 2,
    bedType: "1 King Bed",
    roomSizeSqm: 36,
    tagline: "A little more space. A little more theatre.",
    description:
      "Same king-size ease as the Deluxe, with extra square metres for slow mornings and an upgraded bathroom.",
    amenities: ["King Bed", "Free Wi-Fi", "Smart TV", "Rain Shower", "Lounge Chair", "Mini Bar"],
    thumbnail: `${BASE}/room-super-deluxe.jpg`,
    gallery: [
      `${BASE}/room-super-deluxe.jpg`,
      `${BASE}/room-deluxe.jpg`,
      `${BASE}/room-executive.png`,
    ],
    displayOrder: 4,
  },
  {
    slug: "executive",
    name: "Executive",
    shortName: "Executive",
    pricePerNight: 60000,
    maxGuests: 2,
    bedType: "1 King Bed",
    roomSizeSqm: 40,
    tagline: "For the working week that deserves a softer edge.",
    description:
      "A purpose-built executive room with a generous desk, blackout drapery and a tuned-down palette.",
    amenities: ["King Bed", "Executive Workspace", "High-Speed Wi-Fi", "Smart TV", "Espresso Machine", "Rain Shower"],
    thumbnail: `${BASE}/room-executive.png`,
    gallery: [
      `${BASE}/room-executive.png`,
      `${BASE}/room-super-executive.jpg`,
      `${BASE}/room-deluxe-suite.png`,
    ],
    displayOrder: 5,
  },
  {
    slug: "super-executive",
    name: "Super Executive",
    shortName: "Super Executive",
    pricePerNight: 65000,
    maxGuests: 2,
    bedType: "1 King Bed",
    roomSizeSqm: 44,
    tagline: "Quietly senior. Generously kitted.",
    description:
      "A larger Executive with a discrete sitting area, layered lighting, and the small details that turn business travel into something a little more.",
    amenities: ["King Bed", "Sitting Area", "Executive Workspace", "Smart TV", "Espresso Machine", "Rain Shower"],
    thumbnail: `${BASE}/room-super-executive.jpg`,
    gallery: [
      `${BASE}/room-super-executive.jpg`,
      `${BASE}/room-executive.png`,
      `${BASE}/room-deluxe-suite.png`,
    ],
    displayOrder: 6,
  },
  {
    slug: "deluxe-suite",
    name: "Deluxe Suite",
    shortName: "Deluxe Suite",
    pricePerNight: 80000,
    maxGuests: 2,
    bedType: "1 King Bed",
    roomSizeSqm: 56,
    tagline: "A separate living room. A separate state of mind.",
    description:
      "A proper suite — bedroom, lounge, and a bathroom designed to be lingered in.",
    amenities: ["Separate Lounge", "King Bed", "Soaking Tub", "Rain Shower", "Mini Bar", "Espresso Machine"],
    thumbnail: `${BASE}/room-deluxe-suite.png`,
    gallery: [
      `${BASE}/room-deluxe-suite.png`,
      `${BASE}/room-executive-suite.jpg`,
      `${BASE}/room-presidential.jpg`,
    ],
    badge: "Suite",
    displayOrder: 7,
  },
  {
    slug: "executive-suite",
    name: "Executive Suite",
    shortName: "Executive Suite",
    pricePerNight: 90000,
    maxGuests: 2,
    bedType: "1 King Bed",
    roomSizeSqm: 64,
    tagline: "An office, a bedroom, and a city view, in that order.",
    description:
      "Built for the long stay and the quiet meeting, with a dedicated workspace, a separate lounge, and the kind of bathroom that earns its own ceremony.",
    amenities: ["Dedicated Workspace", "Separate Lounge", "King Bed", "Soaking Tub", "Rain Shower", "Espresso Machine"],
    thumbnail: `${BASE}/room-executive-suite.jpg`,
    gallery: [
      `${BASE}/room-executive-suite.jpg`,
      `${BASE}/room-deluxe-suite.png`,
      `${BASE}/room-presidential.jpg`,
    ],
    badge: "Suite",
    displayOrder: 8,
  },
  {
    slug: "presidential-suite",
    name: "Presidential Suite",
    shortName: "Presidential",
    pricePerNight: 170000,
    maxGuests: 5,
    bedType: "2 King Beds",
    roomSizeSqm: 110,
    tagline: "The top floor, in the truest sense.",
    description:
      "Our flagship apartment-suite — a private dining room, a salon-style lounge, a master bedroom dressed in deep walnut, and a bathroom carved out of stone.",
    amenities: ["Private Dining", "Salon Lounge", "Master Bedroom", "Marble Bathroom", "Soaking Tub", "Walk-In Shower", "Butler on Request"],
    thumbnail: `${BASE}/room-presidential.jpg`,
    gallery: [
      `${BASE}/room-presidential.jpg`,
      `${BASE}/room-executive-suite.jpg`,
      `${BASE}/room-deluxe-suite.png`,
    ],
    badge: "Flagship",
    displayOrder: 9,
  },
];

export function getRoomBySlug(slug: string): Room | undefined {
  return rooms.find((r) => r.slug === slug);
}

export function getFeaturedRooms(count = 6): Room[] {
  return rooms.slice(0, count);
}
