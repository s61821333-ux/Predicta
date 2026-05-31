-- Run after 001_users.sql in Supabase SQL Editor

-- ── user_settings ────────────────────────────────────────────────────────────
create table if not exists public.user_settings (
  user_id uuid primary key references public.users (id) on delete cascade,
  notif_budget boolean not null default true,
  notif_summary boolean not null default true,
  notif_ai boolean not null default false,
  auto_category boolean not null default true,
  future_forecast boolean not null default true,
  rtl_mode boolean not null default true,
  currency_code text not null default 'ILS',
  date_format text not null default 'DD/MM/YYYY',
  updated_at timestamptz not null default now()
);

alter table public.user_settings enable row level security;

create policy "Users manage own settings"
  on public.user_settings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── categories ───────────────────────────────────────────────────────────────
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users (id) on delete cascade,
  name text not null,
  type text not null check (type in ('expense', 'income', 'both')),
  color_hex text,
  icon_name text,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "Anyone can read system categories"
  on public.categories for select
  using (user_id is null or auth.uid() = user_id);

create policy "Users manage own categories"
  on public.categories for insert
  with check (auth.uid() = user_id);

create policy "Users update own categories"
  on public.categories for update
  using (auth.uid() = user_id);

create policy "Users delete own categories"
  on public.categories for delete
  using (auth.uid() = user_id);

-- ── transactions ─────────────────────────────────────────────────────────────
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  amount numeric(12, 2) not null check (amount > 0),
  type text not null check (type in ('expense', 'income')),
  currency text not null default 'ILS',
  description text,
  date timestamptz not null default now(),
  category_id uuid references public.categories (id) on delete set null,
  is_temporary boolean not null default false,
  status text not null default 'completed' check (status in ('completed', 'future')),
  receipt_url text,
  created_at timestamptz not null default now()
);

create index if not exists transactions_user_date_idx
  on public.transactions (user_id, date desc);

alter table public.transactions enable row level security;

create policy "Users manage own transactions"
  on public.transactions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── budgets ──────────────────────────────────────────────────────────────────
create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  month int not null check (month between 1 and 12),
  year int not null,
  amount_limit numeric(12, 2) not null check (amount_limit > 0),
  created_at timestamptz not null default now(),
  unique (user_id, category_id, month, year)
);

alter table public.budgets enable row level security;

create policy "Users manage own budgets"
  on public.budgets for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── chat_messages ────────────────────────────────────────────────────────────
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  is_ai boolean not null default false,
  title text,
  text text not null,
  stats_payload jsonb,
  action_label text,
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_user_created_idx
  on public.chat_messages (user_id, created_at asc);

alter table public.chat_messages enable row level security;

create policy "Users manage own chat messages"
  on public.chat_messages for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── Default categories (system-wide) ─────────────────────────────────────────
insert into public.categories (name, type, color_hex, icon_name, user_id)
select v.name, v.type, v.color_hex, v.icon_name, null
from (values
  ('אוכל',     'expense', '#ff6b00', 'restaurant'),
  ('תחבורה',   'expense', '#5e5e5e', 'directions_car'),
  ('קניות',    'expense', '#5d5f5f', 'shopping_bag'),
  ('בריאות',   'expense', '#00a060', 'fitness_center'),
  ('בילויים',  'expense', '#a04100', 'local_movies'),
  ('דיור',     'expense', '#8e7164', 'home'),
  ('תקשורת',   'expense', '#5e5e5e', 'wifi'),
  ('חינוך',    'expense', '#5d5f5f', 'school'),
  ('אחר',      'both',    '#8e7164', 'more_horiz'),
  ('משכורת',   'income',  '#00a060', 'account_balance'),
  ('פרילנס',   'income',  '#00a060', 'work'),
  ('השקעות',   'income',  '#00a060', 'trending_up'),
  ('מתנה',     'income',  '#00a060', 'card_giftcard'),
  ('החזר',     'income',  '#00a060', 'replay'),
  ('הכנסה',    'income',  '#00a060', 'attach_money')
) as v(name, type, color_hex, icon_name)
where not exists (
  select 1 from public.categories c
  where c.name = v.name and c.user_id is null
);

-- ── Auto-create user_settings on signup ──────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, first_name, last_name, email, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    coalesce(new.email, ''),
    nullif(new.raw_user_meta_data->>'phone', '')
  )
  on conflict (id) do update set
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    email = excluded.email,
    phone = excluded.phone,
    updated_at = now();

  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;
