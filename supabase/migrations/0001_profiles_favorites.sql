-- ZHI TECH · 0001 — profiles and favorites
-- Run once in Supabase: SQL Editor → New query → paste → Run.
--
-- Security model:
-- - Row Level Security on every table: users see and change only their own rows.
-- - "Grant API access to new tables automatically" is OFF for this project,
--   so every table below grants exactly what the website needs, nothing more.
-- - Visitors who are not logged in (anon) get no access to these tables.
-- - Users can never change their own role (editor/admin is set by the owner only).

-- ---------------------------------------------------------------------------
-- Profiles: one row per account, created automatically on sign-up.
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (char_length(display_name) <= 80),
  preferred_locale text check (preferred_locale in ('ar', 'en', 'zh')),
  role text not null default 'user' check (role in ('user', 'editor', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "Users can update their own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Column-level grant: users may edit their name and language, never their role.
grant select on public.profiles to authenticated;
grant update (display_name, preferred_locale) on public.profiles to authenticated;

-- Create the profile when someone signs up.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, left(new.raw_user_meta_data ->> 'display_name', 80));
  return new;
end;
$$;

-- Only the trigger may call it.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Favorites: saved models and tools.
-- tool_slug matches src/content/tools.ts; it becomes a foreign key once the
-- tools table moves into the database.
-- ---------------------------------------------------------------------------
create table public.favorites (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  tool_slug text not null check (tool_slug ~ '^[a-z0-9-]{1,100}$'),
  created_at timestamptz not null default now(),
  primary key (user_id, tool_slug)
);

alter table public.favorites enable row level security;

create policy "Users can read their own favorites"
  on public.favorites for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can add their own favorites"
  on public.favorites for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can remove their own favorites"
  on public.favorites for delete to authenticated
  using ((select auth.uid()) = user_id);

grant select, insert, delete on public.favorites to authenticated;
