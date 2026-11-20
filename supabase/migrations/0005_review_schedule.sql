-- ZHI TECH · 0005 — periodic review tests (spaced review schedule)
-- Run once in Supabase: SQL Editor → New query → paste → Run.
-- Same security model: RLS, own rows only, explicit grants, no access for anon.

-- One row per user and term: which review box the term is in and when it is due again.
-- Box 1 = review tomorrow … box 5 = review in 30 days. A wrong answer sends the term back to box 1.
create table public.review_schedule (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  term_slug text not null check (term_slug ~ '^[a-z0-9-]{1,100}$'),
  box smallint not null default 1 check (box between 1 and 5),
  due_on date not null,
  correct_count integer not null default 0 check (correct_count >= 0),
  wrong_count integer not null default 0 check (wrong_count >= 0),
  last_reviewed_at timestamptz not null default now(),
  primary key (user_id, term_slug)
);

alter table public.review_schedule enable row level security;

create policy "Users can read their own review schedule"
  on public.review_schedule for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can add to their own review schedule"
  on public.review_schedule for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own review schedule"
  on public.review_schedule for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, update on public.review_schedule to authenticated;
