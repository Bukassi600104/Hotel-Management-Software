import type { Metadata } from "next";

import type { Room } from "@/types";
import { siteConfig } from "@/lib/site";

const baseUrl = siteConfig.url.replace(/\/$/, "");
const defaultOgImage = "/hotel-assets/hotel-aerial.jpg";

export type PublicRoute =
  | "/"
  | "/rooms"
  | "/about"
  | "/conference"
  | "/menu"
  | "/drinks"
  | "/guest-guide"
  | "/laundry"
  | "/contact";

export const publicSeoRoutes: Array<{
  path: PublicRoute;
  title: string;
  description: string;
  image: string;
  priority: number;
  changeFrequency: "weekly" | "monthly";
}> = [
  {
    path: "/",
    title: "Hilton Euphoria Hotel | Luxury Hotel in Egbeda, Lagos",
    description:
      "Hilton Euphoria Hotel in Gowon Estate, Egbeda, Lagos offers luxury rooms, dining, rooftop relaxation, conference facilities, and guest services.",
    image: "/hotel-assets/welcome-slide.jpg",
    priority: 1,
    changeFrequency: "weekly",
  },
  {
    path: "/rooms",
    title: "Rooms & Suites in Egbeda, Lagos",
    description:
      "Compare Hilton Euphoria Hotel rooms and suites, from Mini Standard to Presidential Suite, with live availability and direct reservation options.",
    image: "/hotel-assets/room-deluxe-suite.png",
    priority: 0.9,
    changeFrequency: "weekly",
  },
  {
    path: "/about",
    title: "About Hilton Euphoria Hotel",
    description:
      "Learn about Hilton Euphoria Hotel, an independent luxury hotel in Gowon Estate, Egbeda, Lagos focused on quiet hospitality and guest comfort.",
    image: "/hotel-assets/about.webp",
    priority: 0.75,
    changeFrequency: "monthly",
  },
  {
    path: "/conference",
    title: "Conference Room & Event Venue in Egbeda, Lagos",
    description:
      "Book a private conference room in Egbeda, Lagos with audiovisual support, flexible layouts, catering coordination, and hotel hospitality.",
    image: "/hotel-assets/facility-conference.png",
    priority: 0.85,
    changeFrequency: "monthly",
  },
  {
    path: "/menu",
    title: "Restaurant, Breakfast & Bar Menu",
    description:
      "Browse Hilton Euphoria Hotel food, breakfast, wine, spirits, cocktails, beer, soft drinks, and room-service menu options.",
    image: "/hotel-assets/restaurant-dsc6939.jpg",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/drinks",
    title: "Drink Menu & Rooftop Bar Service",
    description:
      "View Hilton Euphoria Hotel drinks, wine, champagne, spirits, cocktails, mocktails, beer, yoghurt, and soft-drink options.",
    image: "/hotel-assets/menu/champagne-sparkling-wine.jpg",
    priority: 0.65,
    changeFrequency: "monthly",
  },
  {
    path: "/guest-guide",
    title: "Guest Guide & Hotel Service Extensions",
    description:
      "Find Hilton Euphoria Hotel Front Desk, restaurant, rooftop bar, executive bar, pool, gym, grill, security, and breakfast information.",
    image: "/hotel-assets/hotel-aerial.jpg",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    path: "/laundry",
    title: "Guest Laundry Service Tariff",
    description:
      "View Hilton Euphoria Hotel guest laundry washing and ironing prices, pickup notes, and Front Desk support information.",
    image: "/hotel-assets/menu/laundry.jpg",
    priority: 0.65,
    changeFrequency: "monthly",
  },
  {
    path: "/contact",
    title: "Contact Hilton Euphoria Hotel in Egbeda, Lagos",
    description:
      "Contact Hilton Euphoria Hotel for reservations, room bookings, conference inquiries, restaurant visits, and directions to Gowon Estate, Egbeda.",
    image: "/hotel-assets/hotel-aerial.jpg",
    priority: 0.85,
    changeFrequency: "monthly",
  },
];

export function absoluteUrl(path = "/") {
  if (path.startsWith("http")) return path;
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildPageMetadata({
  path,
  title,
  description,
  image = defaultOgImage,
  noIndex = false,
}: {
  path: string;
  title: string;
  description: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: "en_NG",
      url,
      siteName: siteConfig.name,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} - ${title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

export function findPublicSeo(path: PublicRoute) {
  return publicSeoRoutes.find((route) => route.path === path);
}

export function buildHotelJsonLd() {
  const phones = siteConfig.contact.phones.map((phone) => phone.number);

  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "@id": `${baseUrl}/#hotel`,
    name: siteConfig.name,
    url: baseUrl,
    image: [
      absoluteUrl("/hotel-assets/hotel-aerial.jpg"),
      absoluteUrl("/hotel-assets/welcome-slide.jpg"),
      absoluteUrl("/hotel-assets/room-deluxe-suite.png"),
    ],
    logo: absoluteUrl("/hotel-assets/logo.png"),
    description: siteConfig.description,
    telephone: phones[0],
    email: siteConfig.contact.email,
    priceRange: "NGN 30000 - NGN 170000",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Plot 18, 21/22 Road, Gowon Estate",
      addressLocality: "Egbeda",
      addressRegion: "Lagos State",
      addressCountry: "NG",
    },
    amenityFeature: [
      "Luxury rooms and suites",
      "Restaurant",
      "Rooftop bar",
      "Conference room",
      "Swimming pool",
      "Gym",
      "Laundry service",
      "24-hour reception",
    ].map((name) => ({
      "@type": "LocationFeatureSpecification",
      name,
      value: true,
    })),
    checkinTime: "15:00",
    checkoutTime: "12:00",
    sameAs: siteConfig.socials.map((social) => social.href),
  };
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    name: siteConfig.name,
    url: baseUrl,
    publisher: {
      "@id": `${baseUrl}/#hotel`,
    },
    inLanguage: "en-NG",
  };
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildRoomJsonLd(room: Room) {
  return {
    "@context": "https://schema.org",
    "@type": "HotelRoom",
    "@id": `${baseUrl}/rooms/${room.slug}#room`,
    name: `${room.name} at ${siteConfig.name}`,
    url: absoluteUrl(`/rooms/${room.slug}`),
    image: room.gallery.map((image) => absoluteUrl(image)),
    description: room.description,
    occupancy: {
      "@type": "QuantitativeValue",
      maxValue: room.maxGuests,
      unitText: "guests",
    },
    bed: room.bedType,
    floorSize: {
      "@type": "QuantitativeValue",
      value: room.roomSizeSqm,
      unitCode: "MTK",
    },
    amenityFeature: room.amenities.map((name) => ({
      "@type": "LocationFeatureSpecification",
      name,
      value: true,
    })),
    containedInPlace: {
      "@id": `${baseUrl}/#hotel`,
    },
    offers: {
      "@type": "Offer",
      price: room.pricePerNight,
      priceCurrency: "NGN",
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`/rooms/${room.slug}`),
    },
  };
}
