import type { Json } from "@/types/database";

export type CmsStatus = "draft" | "published";

export type CmsHeroSlide = {
  img: string;
  sub: string;
  title: string;
};

export type CmsPage = {
  slug: CmsPageSlug;
  title: string;
  status: CmsStatus;
  hero_eyebrow: string;
  hero_title: string;
  hero_description: string;
  hero_image: string;
  seo_title: string;
  seo_description: string;
  content: Record<string, Json>;
  updated_at?: string | null;
  published_at?: string | null;
};

export type CmsPageSlug = "home" | "about" | "conference" | "menu" | "contact";

export type CmsFooterSettings = {
  description: string;
  address: string;
  reservationPhone: string;
  frontDeskPhone: string;
  email: string;
  socials: Array<{ label: string; href: string }>;
};

export const editablePages: Array<{ slug: CmsPageSlug; label: string; href: string }> = [
  { slug: "home", label: "Homepage", href: "/" },
  { slug: "about", label: "About Page", href: "/about" },
  { slug: "conference", label: "Conference Page", href: "/conference" },
  { slug: "menu", label: "Menu Page", href: "/menu" },
  { slug: "contact", label: "Contact Page", href: "/contact" },
];

export const cmsMediaLibrary = [
  "/hotel-assets/welcome-slide.jpg",
  "/hotel-assets/hotel-aerial.jpg",
  "/hotel-assets/rooftop-dsc2573.jpg",
  "/hotel-assets/about.webp",
  "/hotel-assets/room-287.webp",
  "/hotel-assets/facility-rooftop.png",
  "/hotel-assets/facility-conference.png",
  "/hotel-assets/conference-gallery.jpg",
  "/hotel-assets/conference-gallery1.jpg",
  "/hotel-assets/conference-gallery2.jpg",
  "/hotel-assets/restaurant-dsc6939.jpg",
  "/hotel-assets/facility-pool.png",
];

export const defaultCmsPages: Record<CmsPageSlug, CmsPage> = {
  home: {
    slug: "home",
    title: "Homepage",
    status: "published",
    hero_eyebrow: "Comfort & Elegance",
    hero_title: "Luxury Stay Hotel Experience",
    hero_description:
      "Welcome to Lagos' premier five-star deluxe hotel. Experience the perfect blend of elegance and comfort at Hilton Euphoria Hotel.",
    hero_image: "/hotel-assets/welcome-slide.jpg",
    seo_title: "Hilton Euphoria Hotel",
    seo_description:
      "Lagos premier five-star hotel for rooms, dining, conference events, and quiet hospitality.",
    content: {
      heroSlides: [
        {
          img: "/hotel-assets/welcome-slide.jpg",
          sub: "Comfort & Elegance",
          title: "Luxury Stay Hotel Experience",
        },
        { img: "/hotel-assets/hotel-aerial.jpg", sub: "Like Home", title: "Where Every Stay Feels" },
        { img: "/hotel-assets/rooftop-dsc2573.jpg", sub: "Extraordinary", title: "Where Every Stay Is" },
      ],
      aboutLabel: "About Our Hotel",
      aboutTitle: "The Hilton\nEuphoria Hotel",
      aboutSubtitle: "Unparalleled Comfort and Extraordinary Hospitality",
      aboutBody:
        "Welcome to Lagos' premier five-star deluxe hotel. Experience the perfect blend of elegance and comfort at Hilton Euphoria Hotel, where every detail is designed to exceed your expectations.",
      aboutImageOne: "/hotel-assets/about.webp",
      aboutImageTwo: "/hotel-assets/room-287.webp",
      ctaLabel: "Book Your Stay",
      ctaTitle: "Experience Luxury Redefined",
      ctaButtonText: "Make a Reservation",
      ctaButtonHref: "/rooms",
      ctaImage: "/hotel-assets/facility-rooftop.png",
    },
  },
  about: {
    slug: "about",
    title: "About",
    status: "published",
    hero_eyebrow: "Our story",
    hero_title: "A decade of quiet hospitality.",
    hero_description:
      "Euphoria opened in 2014 with a small team and a single idea: that a hotel should feel like a generous host, not a transactional one.",
    hero_image: "/hotel-assets/about.webp",
    seo_title: "About Us",
    seo_description:
      "Quietly placed in Gowon Estate, Egbeda, Euphoria has spent a decade refining generous hospitality.",
    content: {
      storyEyebrow: "Our story",
      storyTitle: "Built slowly, on a quiet street.",
      storyBodyOne:
        "Euphoria began as a single building on the corner of 21/22 Road. The brief was straightforward - a five-star hotel that Lagos could call its own.",
      storyBodyTwo:
        "Ten years later, much of the original team is still here. The rooms have been refreshed twice. The kitchen has been rebuilt.",
      storyBodyThree: "We are private, independent, and committed to running this hotel with care.",
      ctaTitle: "Come and see for yourself.",
      ctaBody: "Book a room, drop in for breakfast, or hold your next gathering in our conference room.",
    },
  },
  conference: {
    slug: "conference",
    title: "Conference",
    status: "published",
    hero_eyebrow: "Conference & events",
    hero_title: "Modern, elegant, kept quiet.",
    hero_description:
      "A purpose-built venue for executive gatherings - sound-treated, lit on dimmers, and supported by a dedicated coordinator from arrival to wrap.",
    hero_image: "/hotel-assets/facility-conference.png",
    seo_title: "Conference Room",
    seo_description:
      "Boardroom-grade venues configured to your agenda with AV, privacy, and dedicated support.",
    content: {
      introEyebrow: "What you get",
      introTitle: "Built around the way meetings actually run.",
      layoutTitle: "Four ways to set the room.",
      layoutBody: "Tell us how you would like the day to go and we will configure accordingly.",
      formTitle: "Tell us about the gathering.",
      formBody:
        "Send a short note with your preferred date, expected guests, and the kind of session you have in mind.",
      ctaTitle: "Ready to walk the room?",
      ctaBody:
        "Site visits are by appointment. We are happy to walk you through the building any weekday morning.",
    },
  },
  menu: {
    slug: "menu",
    title: "Hotel Menu",
    status: "published",
    hero_eyebrow: "In the kitchen",
    hero_title: "Our table, set every day.",
    hero_description:
      "A short menu, cooked carefully - Nigerian classics alongside continental staples, and a bar that takes cocktails as seriously as it takes wine.",
    hero_image: "/hotel-assets/restaurant-dsc6939.jpg",
    seo_title: "Hotel Menu",
    seo_description:
      "Signature dishes from our kitchen, traditional Nigerian flavours, continental staples, and bar service.",
    content: {
      introBody:
        "Our restaurant runs all day, breakfast through to a late kitchen that finishes at 11pm. Room service available 24 hours via the dedicated line. Prices are inclusive of VAT.",
      ctaTitle: "Reserve a table.",
      ctaBody: "Booked tables are released 14 days ahead. Call ahead for parties of six or more.",
      ctaButtonText: "Get in touch",
      ctaButtonHref: "/contact",
    },
  },
  contact: {
    slug: "contact",
    title: "Contact",
    status: "published",
    hero_eyebrow: "Get in touch",
    hero_title: "We are quietly here, on a quiet street.",
    hero_description:
      "Send a note, call the front desk, or drop in unannounced. The reception is staffed twenty-four hours a day.",
    hero_image: "/hotel-assets/about.webp",
    seo_title: "Contact",
    seo_description:
      "Get in touch with Euphoria Hotel for reservations, events, or front desk questions.",
    content: {
      infoEyebrow: "Visit us",
      infoTitle: "Where to find us.",
      socialTitle: "Stay in touch",
    },
  },
};

export const defaultFooterSettings: CmsFooterSettings = {
  description:
    "Experience the perfect blend of elegance and comfort at Hilton Euphoria Hotel, Lagos' premier five-star destination.",
  address: "Plot 18, 21/22 Road, Gowon Estate, Egbeda, Lagos State, Nigeria",
  reservationPhone: "+234 806 026 0260",
  frontDeskPhone: "+234 808 081 4342",
  email: "booking@hiltoneuphoriahotel.com",
  socials: [
    { label: "TikTok", href: "https://tiktok.com" },
    { label: "Twitter", href: "https://twitter.com" },
    { label: "YouTube", href: "https://youtube.com" },
    { label: "Instagram", href: "https://instagram.com" },
  ],
};

export function textContent(page: CmsPage, key: string, fallback = "") {
  const value = page.content[key];
  return typeof value === "string" ? value : fallback;
}

export function slideContent(page: CmsPage) {
  const value = page.content.heroSlides;
  if (!Array.isArray(value)) {
    return defaultCmsPages.home.content.heroSlides as CmsHeroSlide[];
  }
  return value.filter((slide): slide is CmsHeroSlide => {
    if (!slide || typeof slide !== "object" || Array.isArray(slide)) return false;
    const item = slide as Record<string, unknown>;
    return typeof item.img === "string" && typeof item.sub === "string" && typeof item.title === "string";
  });
}
