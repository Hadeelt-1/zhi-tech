-- ZHI TECH · 0004 — personal dictionary
-- Run once in Supabase: SQL Editor → New query → paste → Run.
-- Same security model: RLS, own rows only, explicit grants, no access for anon.

-- Each row is either a term saved from the library (term_slug) or a word the user added (zh + meaning).
create table public.personal_dictionary (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  term_slug text check (term_slug ~ '^[a-z0-9-]{1,100}$'),
  zh text check (char_length(zh) between 1 and 50),
  pinyin text check (char_length(pinyin) <= 100),
  meaning text check (char_length(meaning) between 1 and 200),
  note text check (char_length(note) <= 500),
  created_at timestamptz not null default now(),
  constraint library_or_own check (
    (term_slug is not null and zh is null and meaning is null)
    or (term_slug is null and zh is not null and meaning is not null)
  )
);

-- A library term can be saved only once per user.
create unique index personal_dictionary_one_term
  on public.personal_dictionary (user_id, term_slug) where term_slug is not null;
create index personal_dictionary_user_time on public.personal_dictionary (user_id, created_at desc);

alter table public.personal_dictionary enable row level security;

create policy "Users can read their own dictionary"
  on public.personal_dictionary for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can add to their own dictionary"
  on public.personal_dictionary for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can remove from their own dictionary"
  on public.personal_dictionary for delete to authenticated
  using ((select auth.uid()) = user_id);

grant select, insert, delete on public.personal_dictionary to authenticated;
