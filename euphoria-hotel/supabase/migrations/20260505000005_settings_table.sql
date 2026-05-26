-- Persist hotel identity, contact, operational defaults, and policy copy used by
-- the public site, admin settings page, and transactional emails.

create table if not exists public.settings (
  id integer primary key default 1 check (id = 1),
  hotel_name text not null default 'Hilton Euphoria Hotel',
  short_name text not null default 'Hilton Euphoria',
  tagline text not null default 'Unparalleled Comfort and Extraordinary Hospitality',
  email text not null default 'booking@hiltoneuphoriahotel.com',
  address text not null default 'Plot 18, 21/22 Road, Gowon Estate, Egbeda, Lagos State, Nigeria',
  address_short text not null default 'Gowon Estate, Egbeda, Lagos',
  phone_reservation text not null default '+234 806 026 0260',
  phone_front_desk text not null default '+234 808 081 4342',
  phone_concierge text not null default '+234 905 973 7707',
  phone_events text not null default '+234 809 999 0143',
  whatsapp text not null default '2348060260260',
  check_in_time text not null default '3:00 PM',
  check_out_time text not null default '12:00 PM',
  vat_rate numeric(5,2) not null default 7.5,
  cancellation_policy text not null default 'Free cancellation up to 48 hours before check-in. Cancellations within 48 hours are subject to a one-night charge.',
  updated_at timestamptz default now()
);

insert into public.settings (id)
values (1)
on conflict (id) do nothing;

alter table public.settings enable row level security;

drop trigger if exists settings_updated_at on public.settings;
create trigger settings_updated_at
  before update on public.settings
  for each row execute function public.update_updated_at();
