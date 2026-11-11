-- Cloud copy of each account's study progress (one row per user), synced by src/lib/sync.ts.
create table public.progress (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  state jsonb not null,
  -- Bumped on every write; a device only overwrites the row if it saw the latest rev (see sync.ts).
  rev integer not null default 1,
  updated_at timestamptz not null default now(),
  constraint progress_state_size check (pg_column_size(state) < 2000000)
);

alter table public.progress enable row level security;

create policy "Read own progress" on public.progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Create own progress" on public.progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own progress" on public.progress
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create function public.touch_updated_at() returns trigger
  language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger progress_touch before update on public.progress
  for each row execute function public.touch_updated_at();

-- Crash reports from the app (src/lib/errors.ts). Signed-in users can add their own; nobody can read them
-- through the API. View them in the Supabase dashboard (Table Editor → client_errors).
create table public.client_errors (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  message text not null check (char_length(message) <= 1000),
  stack text check (char_length(stack) <= 4000),
  source text check (char_length(source) <= 100),
  page text check (char_length(page) <= 200),
  user_agent text check (char_length(user_agent) <= 400),
  version text check (char_length(version) <= 40)
);

create index client_errors_user_id_idx on public.client_errors (user_id);

alter table public.client_errors enable row level security;

create policy "Report own errors" on public.client_errors
  for insert to authenticated with check ((select auth.uid()) = user_id);
