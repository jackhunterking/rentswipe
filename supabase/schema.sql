-- Enable PostGIS for location queries if needed (optional, but good for radius)
create extension if not exists postgis;

-- PROFILES
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  avatar_url text,
  bio text,
  onboarding_completed boolean default false,
  preferences jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RENTALS
create table if not exists public.rentals (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  price numeric not null,
  currency text default '$',
  address text,
  city text,
  location point, -- or use postgis geography
  bedrooms integer default 0,
  bathrooms numeric default 0,
  parking boolean default false,
  sqft numeric,
  images text[] default '{}',
  amenities text[] default '{}',
  owner_id uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- FAVORITES (Likes)
create table if not exists public.favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  rental_id uuid references public.rentals(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, rental_id)
);

-- RLS POLICIES (Basic)
alter table public.profiles enable row level security;
alter table public.rentals enable row level security;
alter table public.favorites enable row level security;

-- Policies (Drop first to avoid errors if they exist)
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);

drop policy if exists "Users can insert their own profile." on public.profiles;
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile." on public.profiles;
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

drop policy if exists "Rentals are viewable by everyone." on public.rentals;
create policy "Rentals are viewable by everyone." on public.rentals for select using (true);

drop policy if exists "Users can view their own favorites." on public.favorites;
create policy "Users can view their own favorites." on public.favorites for select using (auth.uid() = user_id);

drop policy if exists "Users can insert their own favorites." on public.favorites;
create policy "Users can insert their own favorites." on public.favorites for insert with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own favorites." on public.favorites;
create policy "Users can delete their own favorites." on public.favorites for delete using (auth.uid() = user_id);
