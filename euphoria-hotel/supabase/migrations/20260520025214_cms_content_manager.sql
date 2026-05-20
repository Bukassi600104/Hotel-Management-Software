-- Client-safe website CMS content. This powers /cms and public website copy
-- without touching rooms, bookings, payments, or hotel operations.

create table if not exists public.cms_pages (
  slug text primary key,
  title text not null,
  status text not null default 'published' check (status in ('draft', 'published')),
  hero_eyebrow text not null default '',
  hero_title text not null default '',
  hero_description text not null default '',
  hero_image text not null default '',
  seo_title text not null default '',
  seo_description text not null default '',
  content jsonb not null default '{}'::jsonb,
  updated_by uuid references public.admin_users(id) on delete set null,
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists public.cms_site_settings (
  key text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_by uuid references public.admin_users(id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.cms_pages enable row level security;
alter table public.cms_site_settings enable row level security;

drop trigger if exists cms_pages_updated_at on public.cms_pages;
create trigger cms_pages_updated_at
  before update on public.cms_pages
  for each row execute function public.update_updated_at();

drop trigger if exists cms_site_settings_updated_at on public.cms_site_settings;
create trigger cms_site_settings_updated_at
  before update on public.cms_site_settings
  for each row execute function public.update_updated_at();

insert into public.cms_pages (
  slug, title, status, hero_eyebrow, hero_title, hero_description, hero_image,
  seo_title, seo_description, content, published_at
) values
(
  'home',
  'Homepage',
  'published',
  'Comfort & Elegance',
  'Luxury Stay Hotel Experience',
  'Welcome to Lagos'' premier five-star deluxe hotel. Experience the perfect blend of elegance and comfort at Hilton Euphoria Hotel.',
  '/hotel-assets/welcome-slide.jpg',
  'Hilton Euphoria Hotel',
  'Lagos premier five-star hotel for rooms, dining, conference events, and quiet hospitality.',
  '{
    "heroSlides": [
      {"img": "/hotel-assets/welcome-slide.jpg", "sub": "Comfort & Elegance", "title": "Luxury Stay Hotel Experience"},
      {"img": "/hotel-assets/hotel-aerial.jpg", "sub": "Like Home", "title": "Where Every Stay Feels"},
      {"img": "/hotel-assets/rooftop-dsc2573.jpg", "sub": "Extraordinary", "title": "Where Every Stay Is"}
    ],
    "aboutLabel": "About Our Hotel",
    "aboutTitle": "The Hilton\nEuphoria Hotel",
    "aboutSubtitle": "Unparalleled Comfort and Extraordinary Hospitality",
    "aboutBody": "Welcome to Lagos'' premier five-star deluxe hotel. Experience the perfect blend of elegance and comfort at Hilton Euphoria Hotel, where every detail is designed to exceed your expectations.",
    "aboutImageOne": "/hotel-assets/about.webp",
    "aboutImageTwo": "/hotel-assets/room-287.webp",
    "ctaLabel": "Book Your Stay",
    "ctaTitle": "Experience Luxury Redefined",
    "ctaButtonText": "Make a Reservation",
    "ctaButtonHref": "/rooms",
    "ctaImage": "/hotel-assets/facility-rooftop.png"
  }'::jsonb,
  now()
),
(
  'about',
  'About',
  'published',
  'Our story',
  'A decade of quiet hospitality.',
  'Euphoria opened in 2014 with a small team and a single idea: that a hotel should feel like a generous host, not a transactional one.',
  '/hotel-assets/about.webp',
  'About Us',
  'Quietly placed in Gowon Estate, Egbeda, Euphoria has spent a decade refining generous hospitality.',
  '{
    "storyEyebrow": "Our story",
    "storyTitle": "Built slowly, on a quiet street.",
    "storyBodyOne": "Euphoria began as a single building on the corner of 21/22 Road. The brief was straightforward - a five-star hotel that Lagos could call its own.",
    "storyBodyTwo": "Ten years later, much of the original team is still here. The rooms have been refreshed twice. The kitchen has been rebuilt.",
    "storyBodyThree": "We are private, independent, and committed to running this hotel with care.",
    "ctaTitle": "Come and see for yourself.",
    "ctaBody": "Book a room, drop in for breakfast, or hold your next gathering in our conference room."
  }'::jsonb,
  now()
),
(
  'conference',
  'Conference',
  'published',
  'Conference & events',
  'Modern, elegant, kept quiet.',
  'A purpose-built venue for executive gatherings - sound-treated, lit on dimmers, and supported by a dedicated coordinator from arrival to wrap.',
  '/hotel-assets/facility-conference.png',
  'Conference Room',
  'Boardroom-grade venues configured to your agenda with AV, privacy, and dedicated support.',
  '{
    "introEyebrow": "What you get",
    "introTitle": "Built around the way meetings actually run.",
    "layoutTitle": "Four ways to set the room.",
    "layoutBody": "Tell us how you would like the day to go and we will configure accordingly.",
    "formTitle": "Tell us about the gathering.",
    "formBody": "Send a short note with your preferred date, expected guests, and the kind of session you have in mind.",
    "ctaTitle": "Ready to walk the room?",
    "ctaBody": "Site visits are by appointment. We are happy to walk you through the building any weekday morning."
  }'::jsonb,
  now()
),
(
  'menu',
  'Hotel Menu',
  'published',
  'In the kitchen',
  'Our table, set every day.',
  'A short menu, cooked carefully - Nigerian classics alongside continental staples, and a bar that takes cocktails as seriously as it takes wine.',
  '/hotel-assets/restaurant-dsc6939.jpg',
  'Hotel Menu',
  'Signature dishes from our kitchen, traditional Nigerian flavours, continental staples, and bar service.',
  '{
    "introBody": "Our restaurant runs all day, breakfast through to a late kitchen that finishes at 11pm. Room service available 24 hours via the dedicated line. Prices are inclusive of VAT.",
    "ctaTitle": "Reserve a table.",
    "ctaBody": "Booked tables are released 14 days ahead. Call ahead for parties of six or more.",
    "ctaButtonText": "Get in touch",
    "ctaButtonHref": "/contact"
  }'::jsonb,
  now()
),
(
  'contact',
  'Contact',
  'published',
  'Get in touch',
  'We are quietly here, on a quiet street.',
  'Send a note, call the front desk, or drop in unannounced. The reception is staffed twenty-four hours a day.',
  '/hotel-assets/about.webp',
  'Contact',
  'Get in touch with Euphoria Hotel for reservations, events, or front desk questions.',
  '{
    "infoEyebrow": "Visit us",
    "infoTitle": "Where to find us.",
    "socialTitle": "Stay in touch"
  }'::jsonb,
  now()
)
on conflict (slug) do nothing;

insert into public.cms_site_settings (key, content)
values (
  'footer',
  '{
    "description": "Experience the perfect blend of elegance and comfort at Hilton Euphoria Hotel, Lagos'' premier five-star destination.",
    "address": "Plot 18, 21/22 Road, Gowon Estate, Egbeda, Lagos State, Nigeria",
    "reservationPhone": "+234 806 026 0260",
    "frontDeskPhone": "+234 808 081 4342",
    "email": "booking@hiltoneuphoriahotel.com",
    "socials": [
      {"label": "TikTok", "href": "https://tiktok.com"},
      {"label": "Twitter", "href": "https://twitter.com"},
      {"label": "YouTube", "href": "https://youtube.com"},
      {"label": "Instagram", "href": "https://instagram.com"}
    ]
  }'::jsonb
)
on conflict (key) do nothing;
