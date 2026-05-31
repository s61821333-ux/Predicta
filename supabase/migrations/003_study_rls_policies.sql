-- RLS policies for profiles, study_sessions, and tasks
-- Run in Supabase SQL Editor after creating the tables.
-- Assumes:
--   profiles.user_id        → auth.users(id)
--   study_sessions.user_id  → auth.users(id)
--   tasks.user_id           → auth.users(id)
--   tasks.session_id        → study_sessions(id) (for session-scoped reads)

-- ─────────────────────────────────────────────────────────────────────────────
-- profiles
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles
  for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ─────────────────────────────────────────────────────────────────────────────
-- study_sessions
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.study_sessions enable row level security;

drop policy if exists "study_sessions_select_own" on public.study_sessions;
create policy "study_sessions_select_own"
  on public.study_sessions
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "study_sessions_insert_own" on public.study_sessions;
create policy "study_sessions_insert_own"
  on public.study_sessions
  for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "study_sessions_update_own" on public.study_sessions;
create policy "study_sessions_update_own"
  on public.study_sessions
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "study_sessions_delete_own" on public.study_sessions;
create policy "study_sessions_delete_own"
  on public.study_sessions
  for delete
  to authenticated
  using (user_id = auth.uid());

-- ─────────────────────────────────────────────────────────────────────────────
-- tasks
-- Read: tasks linked to sessions owned by the current user
-- CUD:  user_id must match auth.uid()
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.tasks enable row level security;

drop policy if exists "tasks_select_own_sessions" on public.tasks;
create policy "tasks_select_own_sessions"
  on public.tasks
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.study_sessions s
      where s.id = tasks.session_id
        and s.user_id = auth.uid()
    )
  );

drop policy if exists "tasks_insert_own" on public.tasks;
create policy "tasks_insert_own"
  on public.tasks
  for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1
      from public.study_sessions s
      where s.id = tasks.session_id
        and s.user_id = auth.uid()
    )
  );

drop policy if exists "tasks_update_own" on public.tasks;
create policy "tasks_update_own"
  on public.tasks
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (
    user_id = auth.uid()
    and exists (
      select 1
      from public.study_sessions s
      where s.id = tasks.session_id
        and s.user_id = auth.uid()
    )
  );

drop policy if exists "tasks_delete_own" on public.tasks;
create policy "tasks_delete_own"
  on public.tasks
  for delete
  to authenticated
  using (user_id = auth.uid());
