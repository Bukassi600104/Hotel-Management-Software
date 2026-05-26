
CREATE TABLE IF NOT EXISTS settings (
  id                   integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  hotel_name           text NOT NULL DEFAULT 'Hilton Euphoria Hotel',
  short_name           text NOT NULL DEFAULT 'Hilton Euphoria',
  tagline              text NOT NULL DEFAULT 'Unparalleled Comfort and Extraordinary Hospitality',
  email                text NOT NULL DEFAULT 'booking@hiltoneuphoriahotel.com',
  address              text NOT NULL DEFAULT 'Plot 18, 21/22 Road, Gowon Estate, Egbeda, Lagos State, Nigeria',
  address_short        text NOT NULL DEFAULT 'Gowon Estate, Egbeda, Lagos',
  phone_reservation    text NOT NULL DEFAULT '+234 806 026 0260',
  phone_front_desk     text NOT NULL DEFAULT '+234 808 081 4342',
  phone_concierge      text NOT NULL DEFAULT '+234 905 973 7707',
  phone_events         text NOT NULL DEFAULT '+234 809 999 0143',
  whatsapp             text NOT NULL DEFAULT '2348060260260',
  check_in_time        text NOT NULL DEFAULT '3:00 PM',
  check_out_time       text NOT NULL DEFAULT '12:00 PM',
  vat_rate             numeric(5,2) NOT NULL DEFAULT 7.5,
  cancellation_policy  text NOT NULL DEFAULT 'Free cancellation up to 48 hours before check-in. Cancellations within 48 hours are subject to a one-night charge.',
  updated_at           timestamptz DEFAULT now()
);

INSERT INTO settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
;
