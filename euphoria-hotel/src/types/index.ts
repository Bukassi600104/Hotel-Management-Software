export type Room = {
  slug: string;
  name: string;
  shortName: string;
  pricePerNight: number;
  maxGuests: number;
  bedType: string;
  roomSizeSqm: number;
  tagline: string;
  description: string;
  amenities: string[];
  thumbnail: string;
  gallery: string[];
  badge?: string;
  displayOrder: number;
};

export type Facility = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  hero: string;
  gallery: string[];
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  rating: number;
  body: string;
  avatar: string;
};

export type MenuItem = {
  id: string;
  category: "breakfast" | "mains" | "drinks" | "desserts";
  name: string;
  description: string;
  price: number;
  image: string;
};

