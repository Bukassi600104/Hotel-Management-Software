-- Returns rooms that are active, have enough capacity, and have no
-- overlapping confirmed/pending bookings or blocked_dates for the requested period.
create or replace function get_available_rooms(
  p_checkin  date,
  p_checkout date,
  p_guests   integer
)
returns setof rooms
language sql
security definer
as $$
  select * from rooms
  where is_active = true
    and max_guests >= p_guests
    and id not in (
      select room_id from bookings
      where status in ('confirmed', 'pending', 'checked_in')
        and check_in_date  < p_checkout
        and check_out_date > p_checkin
    )
    and id not in (
      select room_id from blocked_dates
      where blocked_from < p_checkout
        and blocked_to   > p_checkin
    )
  order by display_order;
$$;
