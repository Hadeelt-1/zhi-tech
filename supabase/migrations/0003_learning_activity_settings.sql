-- ZHI TECH · 0003 — learning activity and settings (for the learning dashboard)
-- Run once in Supabase: SQL Editor → New query → paste → Run.
-- Same security model: RLS, own rows only, explicit grants, no access for anon.

-- One row per lesson attempt. Used for daily/weekly goals and the weekly schedule.
-- Rows cannot be edited or deleted by users, so the history stays honest.
create table public.learning_activity (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  lesson_slug text not null check (lesson_slug ~ '^[a-z0-9-]{1,100}$'),
  score smallint not null check (score between 0 and 100),
  created_at timestamptz not null default now()
);

create index learning_activity_user_time on public.learning_activity (user_id, created_at desc);

alter table public.learning_activity enable row level security;

create policy "Users can read their own activity"
  on public.learning_activity for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can add their own activity"
  on public.learning_activity for insert to authenticated
  with check ((select auth.uid()) = user_id);

grant select, insert on public.learning_activity to authenticated;
grant usage on sequence public.learning_activity_id_seq to authenticated;

-- Personal goals and study days.
-- study_days: 0 = Sunday … 6 = Saturday.
create table public.learning_settings (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  daily_target smallint not null default 1 check (daily_target between 1 and 10),
  weekly_target smallint not null default 5 check (weekly_target between 1 and 50),
  study_days smallint[] not null default '{0,1,2,3,4}'
    check (study_days <@ array[0,1,2,3,4,5,6]::smallint[] and cardinality(study_days) <= 7),
  updated_at timestamptz not null default now()
);

alter table public.learning_settings enable row level security;

create policy "Users can read their own settings"
  on public.learning_settings for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can add their own settings"
  on public.learning_settings for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own settings"
  on public.learning_settings for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, update on public.learning_settings to authenticated;
