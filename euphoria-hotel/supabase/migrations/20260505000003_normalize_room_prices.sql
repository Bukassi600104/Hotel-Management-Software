-- Older seeds stored prices as kobo-sized values while the application
-- treats room prices as Nigerian Naira and converts to kobo only when
-- sending amounts to Paystack. Normalize any already-seeded oversized prices.
update rooms
set price_per_night = price_per_night / 100
where price_per_night >= 1000000;

