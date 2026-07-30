-- Wine Tour Fest - schema Supabase MVP
-- Apply manually from the Supabase SQL editor. Do not expose service_role keys in the frontend.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.event_settings (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Wine Tour Fest',
  description text,
  start_date date,
  end_date date,
  logo_url text,
  cover_url text,
  email text,
  phone text,
  website text,
  instagram text,
  facebook text,
  address text,
  city text,
  province text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.wineries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  short_description text,
  description text,
  logo_url text,
  cover_image_url text,
  gallery_urls text[] not null default '{}',
  address text,
  city text,
  province text,
  latitude numeric,
  longitude numeric,
  phone text,
  email text,
  website text,
  facebook text,
  instagram text,
  opening_hours text,
  tastings text,
  display_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.program_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  event_date date,
  event_time text,
  location text,
  category text,
  image_url text,
  winery_id uuid references public.wineries(id) on delete set null,
  published boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  cover_url text,
  content text,
  published_date date,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  link_url text,
  category text,
  display_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.sponsors
add column if not exists published boolean not null default true;

create table if not exists public.winery_checkins (
  id uuid primary key default gen_random_uuid(),
  winery_id uuid not null references public.wineries(id) on delete cascade,
  visitor_key text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.map_points (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  description text,
  latitude numeric,
  longitude numeric,
  icon text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  device_id text not null unique,
  nickname text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.scores (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  nickname text not null,
  device_id text not null,
  score integer not null default 0 check (score >= 0),
  played_at timestamptz not null default now()
);

create table if not exists public.rewards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  points_required integer not null default 0 check (points_required >= 0),
  image_url text,
  available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists wineries_public_idx on public.wineries (published, display_order, name);
create index if not exists wineries_slug_idx on public.wineries (slug);
create index if not exists program_items_public_idx on public.program_items (published, event_date, display_order);
create index if not exists program_items_winery_idx on public.program_items (winery_id);
create index if not exists news_public_idx on public.news (published, published_date desc);
create index if not exists sponsors_order_idx on public.sponsors (display_order, name);
create index if not exists sponsors_public_idx on public.sponsors (published, display_order, name);
create index if not exists winery_checkins_recent_idx on public.winery_checkins (winery_id, visitor_key, created_at desc);
create index if not exists map_points_category_idx on public.map_points (category);
create index if not exists scores_leaderboard_idx on public.scores (device_id, score desc, played_at asc);
create index if not exists scores_played_at_idx on public.scores (played_at desc);
create index if not exists rewards_available_idx on public.rewards (available, points_required);
create index if not exists settings_key_idx on public.settings (key);

drop trigger if exists set_event_settings_updated_at on public.event_settings;
create trigger set_event_settings_updated_at before update on public.event_settings
for each row execute function public.set_updated_at();

drop trigger if exists set_wineries_updated_at on public.wineries;
create trigger set_wineries_updated_at before update on public.wineries
for each row execute function public.set_updated_at();

drop trigger if exists set_program_items_updated_at on public.program_items;
create trigger set_program_items_updated_at before update on public.program_items
for each row execute function public.set_updated_at();

drop trigger if exists set_news_updated_at on public.news;
create trigger set_news_updated_at before update on public.news
for each row execute function public.set_updated_at();

drop trigger if exists set_sponsors_updated_at on public.sponsors;
create trigger set_sponsors_updated_at before update on public.sponsors
for each row execute function public.set_updated_at();

drop trigger if exists set_map_points_updated_at on public.map_points;
create trigger set_map_points_updated_at before update on public.map_points
for each row execute function public.set_updated_at();

drop trigger if exists set_players_updated_at on public.players;
create trigger set_players_updated_at before update on public.players
for each row execute function public.set_updated_at();

drop trigger if exists set_rewards_updated_at on public.rewards;
create trigger set_rewards_updated_at before update on public.rewards
for each row execute function public.set_updated_at();

drop trigger if exists set_settings_updated_at on public.settings;
create trigger set_settings_updated_at before update on public.settings
for each row execute function public.set_updated_at();

create or replace view public.leaderboard as
select
  row_number() over (order by best.score desc, best.played_at asc) as position,
  best.device_id,
  best.nickname,
  best.score,
  best.played_at
from (
  select distinct on (device_id)
    device_id,
    nickname,
    score,
    played_at
  from public.scores
  order by device_id, score desc, played_at asc
) as best
order by best.score desc, best.played_at asc;

insert into storage.buckets (id, name, public)
values
  ('wineries', 'wineries', true),
  ('news', 'news', true),
  ('sponsors', 'sponsors', true),
  ('event', 'event', true),
  ('rewards', 'rewards', true)
on conflict (id) do update set public = excluded.public;

alter table public.event_settings enable row level security;
alter table public.wineries enable row level security;
alter table public.program_items enable row level security;
alter table public.news enable row level security;
alter table public.sponsors enable row level security;
alter table public.winery_checkins enable row level security;
alter table public.map_points enable row level security;
alter table public.players enable row level security;
alter table public.scores enable row level security;
alter table public.rewards enable row level security;
alter table public.settings enable row level security;

drop policy if exists "Public read event settings" on public.event_settings;
drop policy if exists "Public read published wineries" on public.wineries;
drop policy if exists "Public read published program" on public.program_items;
drop policy if exists "Public read published news" on public.news;
drop policy if exists "Public read sponsors" on public.sponsors;
drop policy if exists "Public create winery checkins" on public.winery_checkins;
drop policy if exists "Public read own winery checkins" on public.winery_checkins;
drop policy if exists "Public read map points" on public.map_points;
drop policy if exists "Public read rewards" on public.rewards;
drop policy if exists "Public read settings" on public.settings;
drop policy if exists "Public create players" on public.players;
drop policy if exists "Public update matching player device" on public.players;
drop policy if exists "Public create scores" on public.scores;
drop policy if exists "Public read leaderboard scores" on public.scores;
drop policy if exists "MVP admin manage event settings" on public.event_settings;
drop policy if exists "MVP admin manage wineries" on public.wineries;
drop policy if exists "MVP admin manage program" on public.program_items;
drop policy if exists "MVP admin manage news" on public.news;
drop policy if exists "MVP admin manage sponsors" on public.sponsors;
drop policy if exists "MVP admin manage winery checkins" on public.winery_checkins;
drop policy if exists "MVP admin manage map points" on public.map_points;
drop policy if exists "MVP admin manage rewards" on public.rewards;
drop policy if exists "MVP admin manage settings" on public.settings;
drop policy if exists "Public upload winery media" on storage.objects;
drop policy if exists "Public update winery media" on storage.objects;
drop policy if exists "Public delete winery media" on storage.objects;
drop policy if exists "Public upload event media" on storage.objects;
drop policy if exists "Public update event media" on storage.objects;
drop policy if exists "Public delete event media" on storage.objects;
drop policy if exists "Public upload news media" on storage.objects;
drop policy if exists "Public update news media" on storage.objects;
drop policy if exists "Public delete news media" on storage.objects;
drop policy if exists "Public upload sponsor media" on storage.objects;
drop policy if exists "Public update sponsor media" on storage.objects;
drop policy if exists "Public delete sponsor media" on storage.objects;
drop policy if exists "Public read media buckets" on storage.objects;

create policy "Public read event settings" on public.event_settings for select using (true);
create policy "Public read published wineries" on public.wineries for select using (published = true);
create policy "Public read published program" on public.program_items for select using (published = true);
create policy "Public read published news" on public.news for select using (published = true);
create policy "Public read sponsors" on public.sponsors for select using (published = true);
create policy "Public read map points" on public.map_points for select using (true);
create policy "Public read rewards" on public.rewards for select using (available = true);
create policy "Public read settings" on public.settings for select using (true);
create policy "Public create players" on public.players for insert with check (true);
create policy "Public update matching player device" on public.players for update using (true) with check (true);
create policy "Public create scores" on public.scores for insert with check (true);
create policy "Public read leaderboard scores" on public.scores for select using (true);
create policy "Public create winery checkins" on public.winery_checkins for insert with check (true);
create policy "Public read own winery checkins" on public.winery_checkins for select using (true);

-- MVP admin policies. Replace with authenticated admin-only policies before public launch.
create policy "MVP admin manage event settings" on public.event_settings for all using (true) with check (true);
create policy "MVP admin manage wineries" on public.wineries for all using (true) with check (true);
create policy "MVP admin manage program" on public.program_items for all using (true) with check (true);
create policy "MVP admin manage news" on public.news for all using (true) with check (true);
create policy "MVP admin manage sponsors" on public.sponsors for all using (true) with check (true);
create policy "MVP admin manage winery checkins" on public.winery_checkins for all using (true) with check (true);
create policy "MVP admin manage map points" on public.map_points for all using (true) with check (true);
create policy "MVP admin manage rewards" on public.rewards for all using (true) with check (true);
create policy "MVP admin manage settings" on public.settings for all using (true) with check (true);

create policy "Public upload winery media" on storage.objects for insert with check (bucket_id = 'wineries');
create policy "Public update winery media" on storage.objects for update using (bucket_id = 'wineries') with check (bucket_id = 'wineries');
create policy "Public delete winery media" on storage.objects for delete using (bucket_id = 'wineries');
create policy "Public upload event media" on storage.objects for insert with check (bucket_id = 'event');
create policy "Public update event media" on storage.objects for update using (bucket_id = 'event') with check (bucket_id = 'event');
create policy "Public delete event media" on storage.objects for delete using (bucket_id = 'event');
create policy "Public upload news media" on storage.objects for insert with check (bucket_id = 'news');
create policy "Public update news media" on storage.objects for update using (bucket_id = 'news') with check (bucket_id = 'news');
create policy "Public delete news media" on storage.objects for delete using (bucket_id = 'news');
create policy "Public upload sponsor media" on storage.objects for insert with check (bucket_id = 'sponsors');
create policy "Public update sponsor media" on storage.objects for update using (bucket_id = 'sponsors') with check (bucket_id = 'sponsors');
create policy "Public delete sponsor media" on storage.objects for delete using (bucket_id = 'sponsors');
create policy "Public read media buckets" on storage.objects for select using (bucket_id in ('wineries', 'news', 'sponsors', 'event', 'rewards'));
