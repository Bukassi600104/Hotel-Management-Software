import type { Facility } from "@/types";

const BASE = "/hotel-assets";

export const facilities: Facility[] = [
  {
    slug: "swimming-pool",
    name: "Swimming Pool",
    icon: "waves",
    tagline: "A long blue line through the centre of the building.",
    description:
      "A heated outdoor pool framed by lounge cabanas and slow-moving palms.",
    hero: `${BASE}/facility-pool.png`,
    gallery: [
      `${BASE}/facility-pool.png`,
      `${BASE}/pool-dsc1980.jpg`,
    ],
  },
  {
    slug: "restaurant",
    name: "Restaurant",
    icon: "utensils",
    tagline: "West African plates, classical technique, candle-lit rooms.",
    description:
      "Our flagship restaurant pairs traditional Nigerian flavours with the discipline of a continental kitchen.",
    hero: `${BASE}/facility-restaurant.png`,
    gallery: [
      `${BASE}/facility-restaurant.png`,
      `${BASE}/restaurant-dsc6939.jpg`,
    ],
  },
  {
    slug: "fitness-center",
    name: "Fitness Center",
    icon: "dumbbell",
    tagline: "A full studio for guests who keep their routine on the road.",
    description:
      "Air-conditioned, mirror-walled, and stocked with cardio, free weights, and resistance equipment.",
    hero: `${BASE}/facility-gym.png`,
    gallery: [
      `${BASE}/facility-gym.png`,
      `${BASE}/gym-dsc5388.jpg`,
    ],
  },
  {
    slug: "conference-room",
    name: "Conference Room",
    icon: "presentation",
    tagline: "Boardroom-grade venues, configured to your agenda.",
    description:
      "Purpose-built rooms for executive gatherings — soundproofed, lit on dimmers, kitted with wireless microphones and ceiling speakers.",
    hero: `${BASE}/facility-conference.png`,
    gallery: [`${BASE}/facility-conference.png`, `${BASE}/conference-gallery2.jpg`],
  },
  {
    slug: "night-club",
    name: "Night Club",
    icon: "music",
    tagline: "Where the house lights drop and the room takes over.",
    description:
      "A discrete club lounge tucked at basement level, with a curated DJ residency, a long bar, and the kind of seating that encourages staying.",
    hero: `${BASE}/night-club.png`,
    gallery: [`${BASE}/night-club.png`, `${BASE}/night-club-square.png`],
  },
  {
    slug: "rooftop-lounge",
    name: "Rooftop Lounge",
    icon: "sun",
    tagline: "Lagos at altitude, with a glass in your hand.",
    description:
      "Our open-air rooftop is the easiest place in the building to lose track of an evening.",
    hero: `${BASE}/facility-rooftop.png`,
    gallery: [
      `${BASE}/facility-rooftop.png`,
      `${BASE}/rooftop-dsc2573.jpg`,
    ],
  },
];

export const secondaryAmenities = [
  {
    name: "Housekeeper",
    icon: "🏠",
    desc: "A dedicated housekeeper ensures every space is spotless, refreshed daily, and always ready for your comfort.",
  },
  {
    name: "WiFi & Internet",
    icon: "📶",
    desc: "High-speed internet throughout the hotel ensures you stay connected, stream content, or work uninterrupted.",
  },
  {
    name: "Laundry Services",
    icon: "👔",
    desc: "Professional laundry and dry-cleaning services available daily to keep your clothes fresh and well-presented.",
  },
  {
    name: "Room Service",
    icon: "🍽",
    desc: "Enjoy delicious meals, drinks, and essentials delivered directly to your room with just a simple call.",
  },
  {
    name: "Private Car Park",
    icon: "🅿",
    desc: "Secure, spacious private parking available for all guests, ensuring safety and convenience throughout your stay.",
  },
  {
    name: "Family Room",
    icon: "👨‍👩‍👧",
    desc: "Spacious family suites designed with comfort in mind, ideal for relaxing, bonding, and sharing special moments.",
  },
  {
    name: "Elevator",
    icon: "🛗",
    desc: "Modern elevator access to all floors, ensuring convenience and ease for all guests during their stay.",
  },
  {
    name: "Smart Home",
    icon: "💡",
    desc: "Rooms equipped with smart lighting, temperature control, and seamless automation for ultimate guest convenience.",
  },
  {
    name: "Executive Bar",
    icon: "🥂",
    desc: "An upscale bar offering premium drinks, cocktails, and an inviting atmosphere perfect for relaxation and networking.",
  },
];
