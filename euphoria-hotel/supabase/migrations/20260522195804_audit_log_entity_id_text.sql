-- CMS pages and several admin entities use slugs/text identifiers in audit logs.
-- Keep audit_log flexible so logging cannot break operational actions.
alter table public.audit_log
  alter column entity_id type text using entity_id::text;
