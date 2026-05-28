-- Lively — screenings table + RLS
--
-- Run this once in: Supabase dashboard → SQL Editor → New query → paste → Run
--
-- What this creates:
--   1. `screenings` table with the columns syncSlice.ts already expects
--   2. Row Level Security policies so each user only sees / writes their own rows
--   3. A grant of API access (we have "auto-expose new tables" OFF, so we grant explicitly)
--   4. An updated_at trigger so we can do client-driven incremental sync later

-- ---------- 1. Table ----------

create table if not exists public.screenings (
  -- Use TEXT for id since the client generates nanoid()s, not UUIDs.
  id          text primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  -- App stores epoch-ms; bigint is plenty.
  created_at  bigint not null,
  label       text not null,
  confidence  real not null check (confidence >= 0 and confidence <= 1),
  -- For future incremental sync queries.
  updated_at  timestamptz not null default now()
);

create index if not exists screenings_user_id_created_at_idx
  on public.screenings (user_id, created_at desc);

-- ---------- 2. updated_at trigger ----------

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists screenings_set_updated_at on public.screenings;
create trigger screenings_set_updated_at
  before update on public.screenings
  for each row execute function public.set_updated_at();

-- ---------- 3. RLS ----------
-- "Automatic RLS" already enabled it on creation, but be explicit.

alter table public.screenings enable row level security;

-- Allow each user to read only their own rows.
drop policy if exists "screenings_select_own" on public.screenings;
create policy "screenings_select_own"
  on public.screenings for select
  using (auth.uid() = user_id);

-- Allow each user to insert only rows tagged with their own user_id.
drop policy if exists "screenings_insert_own" on public.screenings;
create policy "screenings_insert_own"
  on public.screenings for insert
  with check (auth.uid() = user_id);

-- Allow each user to upsert (update) only their own rows.
drop policy if exists "screenings_update_own" on public.screenings;
create policy "screenings_update_own"
  on public.screenings for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Allow each user to delete only their own rows.
drop policy if exists "screenings_delete_own" on public.screenings;
create policy "screenings_delete_own"
  on public.screenings for delete
  using (auth.uid() = user_id);

-- ---------- 4. Expose to the Data API ----------
-- Required because we turned OFF "Automatically expose new tables".

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.screenings to authenticated;

-- Done. Verify by visiting Table Editor — `screenings` should appear with a lock icon (RLS on).
