-- Harden hotel-facing policies and functions used by the booking engine.

create or replace function public.update_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.get_available_rooms(
  p_checkin date,
  p_checkout date,
  p_guests integer
)
returns setof rooms
language sql
security definer
set search_path = public
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

revoke execute on function public.get_available_rooms(date, date, integer) from public, anon, authenticated;

drop policy if exists "Public can insert inquiries" on public.contact_inquiries;

drop policy if exists "Admins read own record" on public.admin_users;
create policy "Admins read own record"
on public.admin_users
for select
using ((select auth.uid()) = id);
