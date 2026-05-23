-- Set search path to the project-specific schema so unqualified table names resolve correctly
SET search_path TO "${SUPABASE_SCHEMA}", public;

-- Enable UUID extension if not already enabled (lives in extensions/public schema)
create extension if not exists "pgcrypto";

-- Hands table: stores every captured/played hand with parsed game state and GTO recommendation
create table if not exists hands (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  game_state jsonb not null,
  gto_recommendation jsonb not null,
  user_action text,
  ev_delta numeric,
  game_type text,
  hero_cards text,
  result text,
  created_at timestamptz not null default now()
);

create index if not exists hands_user_id_idx on hands(user_id);
create index if not exists hands_created_at_idx on hands(created_at desc);
create index if not exists hands_user_created_idx on hands(user_id, created_at desc);

-- Row Level Security: users only read/write their own hands
alter table hands enable row level security;

drop policy if exists "hands_select_own" on hands;
create policy "hands_select_own"
  on hands for select
  using (auth.uid() = user_id);

drop policy if exists "hands_insert_own" on hands;
create policy "hands_insert_own"
  on hands for insert
  with check (auth.uid() = user_id);

drop policy if exists "hands_update_own" on hands;
create policy "hands_update_own"
  on hands for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "hands_delete_own" on hands;
create policy "hands_delete_own"
  on hands for delete
  using (auth.uid() = user_id);
