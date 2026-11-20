-- ZHI TECH · 0002 — lesson progress
-- Run once in Supabase: SQL Editor → New query → paste → Run.
-- Same security model as 0001: RLS, own rows only, explicit grants, no access for anon.

create table public.lesson_progress (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  lesson_slug text not null check (lesson_slug ~ '^[a-z0-9-]{1,100}$'),
  best_score smallint not null check (best_score between 0 and 100),
  attempts integer not null default 1 check (attempts >= 1),
  completed_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_slug)
);

alter table public.lesson_progress enable row level security;

create policy "Users can read their own lesson progress"
  on public.lesson_progress for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can add their own lesson progress"
  on public.lesson_progress for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own lesson progress"
  on public.lesson_progress for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, update on public.lesson_progress to authenticated;
