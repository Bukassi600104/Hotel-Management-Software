-- Add clean guest-service CMS pages for the public website.
-- These pages are intentionally separate from rooms/bookings/admin operations.

insert into public.cms_pages (
  slug, title, status, hero_eyebrow, hero_title, hero_description, hero_image,
  seo_title, seo_description, content, published_at
) values
(
  'guest-guide',
  'Guest Guide',
  'published',
  'Guest services',
  'Everything you need during your stay.',
  'A clean guide to hotel service extensions, breakfast schedules, dining, laundry, wellness, and guest assistance.',
  '/hotel-assets/hotel-aerial.jpg',
  'Guest Guide',
  'Hotel guest guide for Hilton Euphoria Hotel services, breakfast schedule, extensions, restaurant, bar, gym, pool, and security.',
  '{}'::jsonb,
  now()
),
(
  'laundry',
  'Laundry Service',
  'published',
  'Guest laundry',
  'Fresh laundry, neatly handled.',
  'View washing and ironing tariffs for guest laundry service, with quick access to Front Desk support.',
  '/hotel-assets/room-deluxe-suite.png',
  'Laundry Service',
  'Laundry service tariff for Hilton Euphoria Hotel guests, including washing and ironing prices.',
  '{}'::jsonb,
  now()
)
on conflict (slug) do nothing;
