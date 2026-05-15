-- Track whether a booking was paid online or reserved for payment at check-in.
alter table bookings
  add column if not exists booking_type text not null default 'online';

alter table bookings
  alter column booking_type set default 'online';

update bookings
set booking_type = 'online'
where booking_type not in ('online', 'reservation');

alter table bookings
  drop constraint if exists bookings_booking_type_check;

alter table bookings
  add constraint bookings_booking_type_check
  check (booking_type in ('online', 'reservation'));
