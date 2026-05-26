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

export type CmsPageSlug =
  | "home"
  | "about"
  | "conference"
  | "menu"
  | "guest-guide"
  | "laundry"
  | "contact";

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
  { slug: "guest-guide", label: "Guest Guide", href: "/guest-guide" },
  { slug: "laundry", label: "Laundry Service", href: "/laundry" },
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
  "/hotel-assets/facility-restaurant.png",
  "/hotel-assets/rooftop-dsc4286.jpg",
  "/hotel-assets/gym-dsc5399.jpg",
  "/hotel-assets/facility-pool.png",
];

const complimentaryBreakfast = `Monday | Bread, omelette or egg sauce, tea
Tuesday | Moi moi, oat or custard
Wednesday | Noodles, egg, tea, bread, omelette
Thursday | Akara, pap or custard, bread, omelette, tea
Friday | Spaghetti, boiled egg, pancake, tea
Saturday | Boiled potatoes or yam, egg sauce, bread, sunny-side egg, tea
Sunday | Toast bread, tea, bread, omelette`;

const foodMenu = `## Protein, Fried, Peppered & Pepper Soup
Goat Meat - 8,400
Peppered Bush Meat - 10,500
Croaker Fish Pleasure Pepper - 10,500
Croaker Fish Delighter Pepper - 12,600
Croaker Fish Euphoria Pepper - 15,750
Chicken or Turkey Pepper - 9,450
Cow Tail Pepper - 10,500
Cow Leg - 8,400
Prawn Pepper - 12,600
Catfish Pleasure Pepper - 16,800
Catfish Delighter Pepper - 18,900
Catfish Euphoria Pepper - 21,000
Snail - 10,500
Beef - 8,400
Isi Ewu or Ugba - 15,750
Assorted Goat - 7,350
Bush Meat - 10,500
Owere Fish Pepper Soup - 10,000

## Starter Soups
Sweet Corn Soup - 4,725
Sweet and Sour Soup - 4,725
Chicken in Cream Soup - 4,725
Vegetarian Soup - 4,725
Mushroom Soup - 4,725
Served with bread roll

## Pasta & Noodles
Spaghetti Bolognese - 10,500
Creamy Chicken Pasta - 11,550
Seafood Pasta - 12,600
Singapore Noodles - 13,650
Noodles and Egg - 5,250
Noodles - 1,575

## Rice Special
Jollof Rice or White Rice - 2,625
Chinese Rice or Basmati White Rice - 3,675
Fried Rice - 3,150
Coconut Rice or Caribbean Rice - 3,675
Seafood Pineapple Fried Rice - 16,800
Choice of protein: chicken, turkey or fish - 11,550

## Chef Special
Euphoria Platter Special - 21,000
Bomco's Chinese Special - 21,000
Euphoria Peri-Peri - 26,250

## Salad
Coleslaw - 1,575
Fruit Salad - 2,625
Veggies Salad - 4,725
Chicken Caesar Salad - 10,500
Chef Salad - 11,550

## Porridge Meal
Yam or Unripe Plantain - 3,175
Beans - 3,150

## Finger Foods
Club Sandwich and French Fries - 15,750
Spring Roll - 5,775
Chicken Samosa - 6,825
Beef Samosa - 5,775
Shrimp Samosa - 7,875
Plantain Chips - 2,100
Yam Chips - 3,150
French Fries - 3,150
Beef Burger and Chips - 8,925
Chicken Burger and Chips - 13,125
Tuna Sandwich and Chips - 11,025

## National Soup
Seafood Okra - 10,500
Bitter Leaf Soup - 2,625
Ogbono Soup - 3,675
Fisherman Soup - 10,500
White Soup - 5,250
Banga Soup - 5,250
Afang or Edikaikong Soup - 3,675
Okra Soup - 2,625
Oha Soup or Bitter Soup - 2,625
Efo Riro or Egusi Soup - 3,675

## Swallow
Oat Meal, Pando or Plantain Swallow - 2,100
Amala, Garri, Wheat or Semo - 2,100
Pounded Yam - 3,150

## Barbecue
Croaker Fish Delighter BBQ - 16,800
Croaker Fish Euphoria BBQ - 18,900
Catfish Pleasure BBQ - 16,800
Catfish Delighter BBQ - 18,900
Catfish Euphoria BBQ - 21,000
Chicken and Chips - 12,600
Turkey and Chips - 12,600

## Grilled & Platters
T-Bone Steak - 15,750
Served with basmati rice or chips
Lamb Chops - 15,750
Served with basmati rice or chips
Grilled Tiger Prawns - 15,750
Served with basmati rice or chips
Ripe Plantain Platter - 10,500`;

const breakfastMenu = `## Continental Breakfast
Fresh Bread or Toast - 1,575
French Toast - 3,675

## National Breakfast
Fried or Boiled Yam - 3,675
Plantain or Potatoes - 2,625

## Buffet Price
Per Adult - 18,900
Children Below 10 Years - 10,500

## Breakfast Staples
Custard - 1,050
Oat - 1,260
Pap - 1,050
Tin Milk - 2,100

## Choice of Egg
Cheese Omelette - 3,675
Tomato or Spanish Omelette - 2,100
Poached Egg - 1,575
Scrambled Egg or Egg Sauce - 2,625
Boiled Egg or Sunny Side Egg - 1,575
Sardine Omelette - 3,150
Sausage - 1,575
Baked Beans Portion - 1,575
Bacon - 1,575
Glass of Fresh Juice - 3,150
Tea, Coffee or Chocolate - 1,575`;

const drinksMenu = `## Soft Drinks & Juice
Water - 1,000
Fayrouz - 1,475
Coke, Fanta, Sprite or Pepsi - 1,475
Tonic Water - 1,050
Malt - 2,100
Chivita - 4,200
Chi Exotic - 4,200
Apple Exotic - 4,200
Pineapple Juice - 4,200
Cranberry Juice - 10,000

## Red Wine
Escudo Rojo - 31,500
Carlo Rossi - 21,000
De Vin Red or Sweet - 23,100
Cuvee Special - 21,100
Two Oceans - 21,000
Four Cousins - 21,000
4th Street - 21,000
Saint Anna - 21,000
Saint Celine - 21,000
Nederburg - 31,500
Millium - 26,250

## Champagne & Sparkling Wine
Don Perignon - 525,000
Moet & Chandon Rose - 157,500
Moet & Chandon Brut - 126,000
Veuve Clicquot Rose - 136,500
Veuve Clicquot Brut - 105,000
Andre Rose - 26,250
Andre Brut - 21,000
Rich Lady - 21,000
Martini Brut or Rose - 31,500
Metus Rose - 21,000
Belaire Rare Rose - 105,000

## Whiskies
Blue Label - 420,000
Black Label - 57,750
Red Label - 36,750
Glenfiddich 21 Years - 315,000
Glenfiddich 18 Years - 126,000
Glenfiddich 15 Years - 105,000
Singleton 12 Years - 94,500
Jameson Black - 57,750
Jameson Green - 42,000
Jack Daniel's - 57,750
Monkey Shoulder - 42,000

## Cognac
Hennessy XO - 525,000
Hennessy VSOP - 136,500
Hennessy VS - 85,000
Remy Martin XO - 420,000
Remy Martin 1738 - 115,500
Remy Martin VSOP - 126,000

## Tequila
Casamigos - 262,500
Jose Cuervo - 73,500
Olmeca Silver - 52,500
Olmeca Gold - 47,250
Sierra - 36,750
Shots - 3,150

## Vodka/Gin
Absolut - 36,750
Skyy - 21,000
Magic Moment - 15,750
Smirnoff X1 Big - 15,750
Smirnoff X1 Small - 3,675
Gordon's - 11,025
Gordon's Small - 3,150

## Rum & Bitters
Bacardi Silver - 36,750
Jagermeister 70cl - 31,500
Campari Big - 42,000
Campari Mid - 22,050

## Liqueur/Creams
American Honey/Africa Honey Stings - 42,000
Baileys Irish Cream - 31,500
Maloney Creams - 31,500
Amarula Cream - 26,250
Best Cream - 31,500
Best Cream Small - 4,200

## Bitters
Big Action - 6,300
Action - 2,625
Odogwu - 2,100
Ace Bitters - 1,575
Origin - 2,625
Big Origin - 8,400
Long Jack - 1,050

## Mocktails
Morish - 4,200
Coconut syrup, pineapple juice, passion fruit puree
Rosemary Berry - 4,200
Rosemary syrup, lemon juice, Sprite, strawberry syrup
Chapman - 5,250
Sprite, orange juice, Fanta, Angostura bitters, grenadine syrup
Mango Mule - 5,250
Mango puree, mango juice, ginger juice, lemon juice
Vanilla Milkshake - 5,250
Strawberry Milkshake - 5,250
Chocolate Milkshake - 5,250
Banana Smoothie - 5,250
Pineapple Smoothie - 5,250
Apple Smoothie - 5,250

## Cocktails
Long Island Iced Tea - 5,250
Sex on the Beach - 5,250
Pina Colada - 5,250
Mojito - 5,250
Strawberry Daiquiri - 5,250
Mai Tai - 5,250
Negroni - 5,250
Blue Lagoon - 5,250
Margarita - 5,250

## Energy Drinks
Red Bull Small - 2,625
Power Horse - 2,100
Blue Bullet - 2,100
Black Bullet - 2,625
Climax - 1,575
Fearless - 1,575
Predator - 1,575

## Non-Alcoholic Wine
Chamdor - 10,500
Angel - 7,350
Eva - 7,350
Pure Heaven - 10,500

## Yoghurt
Hollandia Yoghurt - 4,200
Farm Fresh Yoghurt - 6,300
Refresh Yoghurt - 5,775

## Beer
Heineken - 3,150
Budweiser - 2,625
Stout - 3,150
Legend - 2,100
Goldberg - 2,625
Trophy - 2,100
Big Smirnoff Ice - 2,625
Small Smirnoff Ice - 1,575
Desperado - 2,625
Life - 2,100
Tiger - 2,100
Flying Fish - 2,625
Gulder - 2,625
Origin Beer - 2,625
Hero - 2,100
Star Radler - 2,625
Castle Lite - 2,625
Budweiser Royal - 3,150`;

const laundryTariff = `Shirt | 700 | 500
Trouser | 700 | 500
Men's Native | 2,000 | 1,000
Boxers | 300 | 200
Singlet | 300 | 400
Face Towel | 300 | 400
T-Shirt | 500 | 500
Polo Shirt | 500 | 300
Gown | 1,000 | 300
Skirt | 500 | 2,000
Blouse | 500 | 700
Agbada Set | 3,000 | 1,000
Safari Suit | 1,000 | 500
Ladies Native Complete | 2,000 | 1,000
Jean Trouser | 1,000 | 700
Skirt/Blouse Silk | 2,500 | 300
Sweater | 2,000 | 300
Socks/Napkin | 500 | 1,000
Night Gown | 500 | 500
Bed Sheet | 2,000 | 1,000
Pant/Bra | 1,500 | 500`;

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
      foodMenu,
      breakfastMenu,
      drinksMenu,
      foodImage: "/hotel-assets/menu/protein-fried-pepper.jpg",
      breakfastImage: "/hotel-assets/menu/complimentary-breakfast.jpg",
      drinksImage: "/hotel-assets/menu/mocktail.jpg",
      ctaTitle: "Reserve a table.",
      ctaBody: "Booked tables are released 14 days ahead. Call ahead for parties of six or more.",
      ctaButtonText: "Get in touch",
      ctaButtonHref: "/contact",
    },
  },
  "guest-guide": {
    slug: "guest-guide",
    title: "Guest Guide",
    status: "published",
    hero_eyebrow: "Guest services",
    hero_title: "Everything you need during your stay.",
    hero_description:
      "A clean guide to hotel service extensions, breakfast schedules, dining, laundry, wellness, and guest assistance.",
    hero_image: "/hotel-assets/hotel-aerial.jpg",
    seo_title: "Guest Guide",
    seo_description:
      "Hotel guest guide for Hilton Euphoria Hotel services, breakfast schedule, extensions, restaurant, bar, gym, pool, and security.",
    content: {
      introTitle: "Welcome to Hilton Euphoria Hotel.",
      introBody:
        "Hilton Euphoria Hotel offers a seamless blend of luxury and practical guest support. Use this guide to reach the right service desk, plan breakfast, and find the hotel facilities available during your stay.",
      serviceNumbers: `Front Desk | 1000 / 2000
Restaurant | 4004
Rooftop Bar | 4050
Executive Bar | 4007
Pool | 4060
Grill | 1087
Gym | 4008
Security Gate | 7000 / 2000`,
      breakfastTitle: "Complimentary breakfast",
      breakfastSchedule: complimentaryBreakfast,
      breakfastNote:
        "Complimentary breakfast is served in the restaurant. Room service breakfast attracts an additional service charge.",
      ctaTitle: "Need help from your room?",
      ctaBody:
        "Call Front Desk on 1000 or 2000 for service requests, directions, reservations, and guest assistance.",
    },
  },
  laundry: {
    slug: "laundry",
    title: "Laundry Service",
    status: "published",
    hero_eyebrow: "Guest laundry",
    hero_title: "Fresh laundry, neatly handled.",
    hero_description:
      "View washing and ironing tariffs for guest laundry service, with quick access to Front Desk support.",
    hero_image: "/hotel-assets/room-deluxe-suite.png",
    seo_title: "Laundry Service",
    seo_description:
      "Laundry service tariff for Hilton Euphoria Hotel guests, including washing and ironing prices.",
    content: {
      introTitle: "Laundry service for in-house guests.",
      introBody:
        "Send laundry requests through Front Desk and our housekeeping team will guide pickup, delivery, and expected return time.",
      intercom: "1000 / 2000",
      laundryImage: "/hotel-assets/menu/laundry.jpg",
      laundryImageTwo: "/hotel-assets/menu/laundry-care.jpg",
      laundryImageThree: "/hotel-assets/menu/laundry-room.jpg",
      serviceNote:
        "Prices are listed in Nigerian naira. Please confirm special fabrics and urgent requests with Front Desk before pickup.",
      laundryTariff,
      ctaTitle: "Questions about your laundry?",
      ctaBody: "Front Desk will confirm pickup, expected delivery time, and care notes for delicate items.",
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
    hero_image: "/hotel-assets/hotel-aerial.jpg",
    seo_title: "Contact",
    seo_description:
      "Get in touch with Euphoria Hotel for reservations, events, or front desk questions.",
    content: {
      infoEyebrow: "Visit us",
      infoTitle: "Where to find us.",
      heroImageOverride: "/hotel-assets/hotel-aerial.jpg",
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
    { label: "Hilton Euphoria Instagram", href: "https://www.instagram.com/hiltoneuphoriahotel/" },
    { label: "Klub Euphoria Instagram", href: "https://www.instagram.com/klubeuphoria/" },
    { label: "Hilton Euphoria Hotel Facebook", href: "https://www.facebook.com/HiltonEuphoriaHotel" },
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
