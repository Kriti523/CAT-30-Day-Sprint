-- CAT 30-Day Sprint: saved progress, one row per account.
-- Run once in your Supabase project: SQL Editor → New query → paste this file → Run. Safe to run again.

create table if not exists public.progress (
  user_id   uuid primary key references auth.users (id) on delete cascade,
  state     jsonb not null,                       -- everything the app saves (attempts, notes, plan ticks, …)
  version   integer not null default 1,           -- goes up by one on every save; stops devices overwriting each other
  edited_at timestamptz not null default now(),   -- when the saved edit was made
  constraint progress_state_size check (octet_length(state::text) < 5000000)
);

-- Each person can read and write only their own row. Signed-out visitors can't touch the table.
alter table public.progress enable row level security;

drop policy if exists "Read own progress" on public.progress;
create policy "Read own progress" on public.progress
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "Create own progress" on public.progress;
create policy "Create own progress" on public.progress
  for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "Update own progress" on public.progress;
create policy "Update own progress" on public.progress
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- Signed-in people may read, create and update (never delete); signed-out visitors get nothing.
revoke all on public.progress from anon, authenticated;
grant select, insert, update on public.progress to authenticated;

-- ---------------------------------------------------------------------------------------------------
-- Optional: paid access. Only needed when the app is built with VITE_REQUIRE_PURCHASE=true.
-- One row per account that has unlocked the full app with a Gumroad license key. Rows are written only
-- by the claim-license function (which uses the service role); people can read their own row.
create table if not exists public.entitlements (
  user_id        uuid primary key references auth.users (id) on delete cascade,
  license_key    text not null unique,               -- one key unlocks one account
  purchase_email text,
  verified_at    timestamptz not null default now()
);

alter table public.entitlements enable row level security;

drop policy if exists "Read own entitlement" on public.entitlements;
create policy "Read own entitlement" on public.entitlements
  for select to authenticated using ((select auth.uid()) = user_id);

revoke all on public.entitlements from anon, authenticated;
grant select on public.entitlements to authenticated;
