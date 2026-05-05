import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const schema = `
-- ENUMS
do $$ begin
  create type booking_status as enum (
    'pending','confirmed','cancelled','refunded','expired','checked_in','checked_out'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type admin_role as enum ('super_admin','manager','staff');
exception when duplicate_object then null; end $$;

-- ROOMS
create table if not exists rooms (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  slug             text unique not null,
  short_name       text,
  description      text,
  short_description text,
  price_per_night  integer not null,
  max_guests       integer not null default 2,
  bed_type         text,
  room_size_sqm    integer,
  thumbnail_url    text,
  gallery_urls     text[],
  amenities        text[],
  badge            text,
  is_active        boolean default true,
  display_order    integer default 0,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- BOOKINGS
create table if not exists bookings (
  id                  uuid primary key default gen_random_uuid(),
  booking_reference   text unique not null,
  room_id             uuid references rooms(id) not null,
  guest_name          text not null,
  guest_email         text not null,
  guest_phone         text not null,
  check_in_date       date not null,
  check_out_date      date not null,
  num_adults          integer not null default 1,
  num_children        integer default 0,
  total_nights        integer not null,
  price_per_night     integer not null,
  subtotal            integer not null,
  vat_amount          integer not null default 0,
  total_amount        integer not null,
  status              booking_status default 'pending',
  paystack_reference  text,
  arrival_time        text,
  notes               text,
  internal_notes      text,
  paid_at             timestamptz,
  cancelled_at        timestamptz,
  cancellation_reason text,
  created_at          timestamptz default now()
);

create index if not exists idx_bookings_dates on bookings(check_in_date, check_out_date);
create index if not exists idx_bookings_room  on bookings(room_id);
create index if not exists idx_bookings_status on bookings(status);
create index if not exists idx_bookings_reference on bookings(booking_reference);
create index if not exists idx_bookings_email on bookings(guest_email);

-- BLOCKED DATES
create table if not exists blocked_dates (
  id           uuid primary key default gen_random_uuid(),
  room_id      uuid references rooms(id) not null,
  blocked_from date not null,
  blocked_to   date not null,
  reason       text,
  created_by   uuid,
  created_at   timestamptz default now()
);

create index if not exists idx_blocks_dates on blocked_dates(blocked_from, blocked_to);
create index if not exists idx_blocks_room  on blocked_dates(room_id);

-- ADMIN USERS
create table if not exists admin_users (
  id             uuid primary key references auth.users(id) on delete cascade,
  email          text unique not null,
  full_name      text,
  role           admin_role default 'staff',
  is_active      boolean default true,
  last_active_at timestamptz,
  created_at     timestamptz default now()
);

-- CONTACT INQUIRIES
create table if not exists contact_inquiries (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text,
  phone      text,
  topic      text,
  message    text not null,
  source     text default 'contact',
  is_read    boolean default false,
  created_at timestamptz default now()
);

-- AUDIT LOG
create table if not exists audit_log (
  id            uuid primary key default gen_random_uuid(),
  admin_user_id uuid references admin_users(id),
  action        text not null,
  entity_type   text,
  entity_id     uuid,
  details       jsonb,
  created_at    timestamptz default now()
);

-- ROW LEVEL SECURITY
alter table rooms             enable row level security;
alter table bookings          enable row level security;
alter table blocked_dates     enable row level security;
alter table admin_users       enable row level security;
alter table contact_inquiries enable row level security;
alter table audit_log         enable row level security;

do $$ begin
  create policy "Public reads active rooms" on rooms
    for select using (is_active = true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Admins read own record" on admin_users
    for select using (auth.uid() = id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Public can insert inquiries" on contact_inquiries
    for insert with check (true);
exception when duplicate_object then null; end $$;

-- UPDATED_AT TRIGGER
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists rooms_updated_at on rooms;
create trigger rooms_updated_at
  before update on rooms
  for each row execute function update_updated_at();
`;

// Columns: name, slug, short_name, description, short_description,
//          price_per_night (kobo), max_guests, bed_type, room_size_sqm,
//          thumbnail_url, gallery_urls, amenities, badge, display_order
const seed = `
insert into rooms (
  name, slug, short_name, description, short_description,
  price_per_night, max_guests, bed_type, room_size_sqm,
  thumbnail_url, gallery_urls, amenities, badge, display_order
) values
(
  'Mini Standard', 'mini-standard', 'Mini Standard',
  'A compact, thoughtfully designed room perfect for solo travellers or couples on a short stay. Every centimetre is used with purpose.',
  'Compact comfort for short stays.',
  3000000, 2, '1 Full Bed', 22,
  '/hotel-assets/room-mini-standard.png',
  ARRAY['/hotel-assets/room-mini-standard.png','/hotel-assets/room-standard.png','/hotel-assets/room-deluxe.jpg'],
  ARRAY['High-Speed Wi-Fi','Air Conditioning','Smart TV','Daily Housekeeping','Work Desk'],
  null, 1
),
(
  'Standard', 'standard', 'Standard',
  'A well-appointed room with generous space for relaxing after a long day. Ideal for business or leisure.',
  'Generous space, every comfort covered.',
  4000000, 2, '1 Full Bed', 26,
  '/hotel-assets/room-standard.png',
  ARRAY['/hotel-assets/room-standard.png','/hotel-assets/room-mini-standard.png','/hotel-assets/room-deluxe.jpg'],
  ARRAY['High-Speed Wi-Fi','Air Conditioning','Smart TV','Daily Housekeeping','Work Desk','Wardrobe'],
  null, 2
),
(
  'Deluxe', 'deluxe', 'Deluxe',
  'Elevated comfort with premium finishes. A king bed, refined bathroom, and curated amenities for guests who expect more.',
  'Elevated comfort, premium finishes.',
  5000000, 2, '1 King Bed', 32,
  '/hotel-assets/room-deluxe.jpg',
  ARRAY['/hotel-assets/room-deluxe.jpg','/hotel-assets/room-standard.png','/hotel-assets/room-executive.png'],
  ARRAY['High-Speed Wi-Fi','Air Conditioning','Smart TV','Daily Housekeeping','Work Desk','King Bed','Rain Shower','Mini Bar','Espresso Machine'],
  'Popular', 3
),
(
  'Super Deluxe', 'super-deluxe', 'Super Deluxe',
  'One step above Deluxe — a wider room, deeper soaking amenities, and extra space to breathe.',
  'More space, deeper comfort.',
  5500000, 2, '1 King Bed', 36,
  '/hotel-assets/room-super-deluxe.jpg',
  ARRAY['/hotel-assets/room-super-deluxe.jpg','/hotel-assets/room-deluxe.jpg','/hotel-assets/room-executive.png'],
  ARRAY['High-Speed Wi-Fi','Air Conditioning','Smart TV','Daily Housekeeping','Work Desk','King Bed','Rain Shower','Mini Bar','Espresso Machine','Bathrobe & Slippers'],
  null, 4
),
(
  'Executive', 'executive', 'Executive',
  'Designed for the discerning business traveller. A king bed, workstation, and premium amenities built for productivity and rest.',
  'Built for the discerning business traveller.',
  6000000, 2, '1 King Bed', 40,
  '/hotel-assets/room-executive.png',
  ARRAY['/hotel-assets/room-executive.png','/hotel-assets/room-super-deluxe.jpg','/hotel-assets/room-executive-suite.jpg'],
  ARRAY['High-Speed Wi-Fi','Air Conditioning','Smart TV','Daily Housekeeping','King Bed','Rain Shower','Mini Bar','Espresso Machine','Bathrobe & Slippers','Executive Work Desk'],
  null, 5
),
(
  'Super Executive', 'super-executive', 'Super Executive',
  'The pinnacle of our executive category. More floor space, enhanced amenities, and the quiet of a premium floor.',
  'Maximum executive comfort.',
  6500000, 2, '1 King Bed', 44,
  '/hotel-assets/room-super-executive.jpg',
  ARRAY['/hotel-assets/room-super-executive.jpg','/hotel-assets/room-executive.png','/hotel-assets/room-deluxe-suite.png'],
  ARRAY['High-Speed Wi-Fi','Air Conditioning','Smart TV','Daily Housekeeping','King Bed','Rain Shower','Mini Bar','Espresso Machine','Bathrobe & Slippers','Executive Work Desk','Evening Turndown'],
  null, 6
),
(
  'Deluxe Suite', 'deluxe-suite', 'Deluxe Suite',
  'A suite with a separate lounge area and bedroom. Thoughtfully furnished for guests who need room to live, not just sleep.',
  'Suite living with a separate lounge.',
  8000000, 2, '1 King Bed', 56,
  '/hotel-assets/room-deluxe-suite.png',
  ARRAY['/hotel-assets/room-deluxe-suite.png','/hotel-assets/room-super-executive.jpg','/hotel-assets/room-executive-suite.jpg'],
  ARRAY['High-Speed Wi-Fi','Air Conditioning','Smart TV','Daily Housekeeping','King Bed','Rain Shower','Mini Bar','Espresso Machine','Bathrobe & Slippers','Separate Lounge','Soaking Tub'],
  'Suite', 7
),
(
  'Executive Suite', 'executive-suite', 'Executive Suite',
  'Two rooms, one vision of luxury. A full suite with lounge and premium executive finishes throughout.',
  'Full suite luxury.',
  9000000, 2, '1 King Bed', 64,
  '/hotel-assets/room-executive-suite.jpg',
  ARRAY['/hotel-assets/room-executive-suite.jpg','/hotel-assets/room-deluxe-suite.png','/hotel-assets/room-presidential.jpg'],
  ARRAY['High-Speed Wi-Fi','Air Conditioning','Smart TV','Daily Housekeeping','King Bed','Rain Shower','Mini Bar','Espresso Machine','Bathrobe & Slippers','Separate Lounge','Soaking Tub','Dining Area'],
  'Suite', 8
),
(
  'Presidential Suite', 'presidential-suite', 'Presidential Suite',
  'The highest expression of hospitality at Hilton Euphoria. Two king bedrooms, a private dining room, and butler service on request.',
  'Our finest accommodation.',
  17000000, 5, '2 King Beds', 110,
  '/hotel-assets/room-presidential.jpg',
  ARRAY['/hotel-assets/room-presidential.jpg','/hotel-assets/room-executive-suite.jpg','/hotel-assets/room-deluxe-suite.png'],
  ARRAY['High-Speed Wi-Fi','Air Conditioning','Smart TV','Daily Housekeeping','2 King Beds','Rain Shower','Mini Bar','Espresso Machine','Bathrobe & Slippers','Separate Lounge','Soaking Tub','Private Dining Room','Butler on Request'],
  'Flagship', 9
)
on conflict (slug) do nothing;
`;

async function run() {
  try {
    await client.connect();
    console.log('Connected to Supabase...');
    await client.query(schema);
    console.log('✓ Schema applied (all 6 tables, RLS, indexes, trigger)');
    await client.query(seed);
    console.log('✓ 9 rooms seeded');
    const { rows } = await client.query('select count(*) from rooms');
    console.log(`✓ Rooms in database: ${rows[0].count}`);
    console.log('\nDatabase is ready.');
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
