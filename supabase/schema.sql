-- MediVerse — Postgres schema for Supabase
--
-- Run this in the Supabase dashboard: SQL Editor → New query → paste → Run.
-- Safe to re-run: every statement is idempotent.
--
-- THE SECURITY MODEL, in one paragraph: the browser holds only the publishable
-- key, which is public by design and grants nothing on its own. Every table
-- below has Row Level Security ENABLED, so Postgres itself decides what each
-- request may see, based on the JWT Supabase issues at login. A user cannot
-- read another user's health record even by crafting their own API call,
-- because the check happens in the database, not in React. This is what makes
-- it real security rather than the client-side check we have today.

-- ---------------------------------------------------------------- extensions
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------- roles
-- Role lives in its own table, NOT in user metadata: metadata is editable by
-- the user in some flows, and "the user can edit their own role" is how you
-- hand out free admin accounts.
create table if not exists public.user_roles (
  user_id    uuid primary key references auth.users on delete cascade,
  role       text not null default 'patient' check (role in ('patient','staff','admin')),
  created_at timestamptz not null default now()
);

-- SECURITY DEFINER so the policies below can check a role without the caller
-- needing read access to the whole table (which would leak who the admins are).
create or replace function public.current_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select role from public.user_roles where user_id = auth.uid()), 'patient');
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select public.current_role() = 'admin'; $$;

-- Everyone signing up starts as a patient. Promotion to staff/admin is a
-- deliberate manual step in the dashboard — never self-service.
--
-- Also seeds a profile row carrying the phone number Supabase verified, so
-- the app has it without a second round trip and ambulance callbacks work
-- from the moment someone signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.user_roles (user_id, role) values (new.id, 'patient')
  on conflict (user_id) do nothing;

  insert into public.profiles (user_id, phone)
  values (new.id, coalesce(new.phone, new.raw_user_meta_data->>'phone'))
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------- profiles
create table if not exists public.profiles (
  user_id    uuid primary key references auth.users on delete cascade,
  name       text,
  age        int check (age is null or (age > 0 and age < 130)),
  location   text,
  phone      text,
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------- health profiles (sensitive)
-- Under India's DPDP Act 2023 this is sensitive personal data. It is isolated
-- in its own table so its policies are simple enough to be obviously correct:
-- the owner, and nobody else. Not even an admin.
create table if not exists public.health_profiles (
  user_id         uuid primary key references auth.users on delete cascade,
  age             int,
  gender          text,
  weight_kg       numeric,
  height_cm       numeric,
  blood_group     text,
  conditions      text[] not null default '{}',
  surgeries       text[] not null default '{}',
  drug_allergies  text[] not null default '{}',
  other_allergies text[] not null default '{}',
  medications     text[] not null default '{}',
  family_history  text[] not null default '{}',
  lifestyle       jsonb  not null default '{}'::jsonb,
  updated_at      timestamptz not null default now()
);

create table if not exists public.medications (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users on delete cascade,
  name       text not null,
  schedule   text,
  remaining  int  not null default 0,
  taken      boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists medications_user_idx on public.medications(user_id);

-- ---------------------------------------------------------------- directory
create table if not exists public.hospitals (
  id              text primary key,
  name            text not null,
  state           text not null,
  city            text not null,
  area            text,
  address         text not null,
  phone           text not null,
  emergency_phone text,
  email           text,
  website         text,
  doctors_url     text,
  verified        text not null check (verified in ('direct','govt','search','listings')),
  note            text,
  hidden          boolean not null default false,  -- soft delete, same as today
  updated_at      timestamptz not null default now()
);
create index if not exists hospitals_location_idx on public.hospitals(state, city) where not hidden;

create table if not exists public.doctors (
  id             text primary key,
  name           text not null,
  specialty      text not null,
  state          text not null,
  experience     int,
  qualifications text,
  hospital       text,
  languages      text[] not null default '{}',
  fee            int,
  rating         numeric,
  status         text,
  next_slot      text,
  featured       boolean not null default false,
  nationwide     boolean not null default false,
  hidden         boolean not null default false,
  updated_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------- reports
create table if not exists public.reports (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references auth.users on delete set null,
  kind       text not null check (kind in ('support','emergency')),
  payload    jsonb not null,
  handled    boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists reports_user_idx on public.reports(user_id);

-- ---------------------------------------------------------------- audit log
create table if not exists public.audit_log (
  id          uuid primary key default uuid_generate_v4(),
  actor_id    uuid references auth.users on delete set null,
  action      text not null,
  target_id   text,
  target_label text,
  fields      text[],
  created_at  timestamptz not null default now()
);

-- ===========================================================================
-- ROW LEVEL SECURITY — the part that actually protects anything
-- ===========================================================================
alter table public.user_roles      enable row level security;
alter table public.profiles        enable row level security;
alter table public.health_profiles enable row level security;
alter table public.medications     enable row level security;
alter table public.hospitals       enable row level security;
alter table public.doctors         enable row level security;
alter table public.reports         enable row level security;
alter table public.audit_log       enable row level security;

-- Roles: you may read your own row; nobody writes via the API (dashboard only).
drop policy if exists user_roles_self_read on public.user_roles;
create policy user_roles_self_read on public.user_roles
  for select using (user_id = auth.uid());

-- Profiles: owner full access.
drop policy if exists profiles_owner on public.profiles;
create policy profiles_owner on public.profiles
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Health data: owner ONLY. Deliberately no admin exception — an admin has no
-- clinical reason to read a patient's conditions, and the safest way to
-- guarantee that is to make it impossible rather than to rely on restraint.
drop policy if exists health_owner on public.health_profiles;
create policy health_owner on public.health_profiles
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists medications_owner on public.medications;
create policy medications_owner on public.medications
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Directory: readable by anyone (including signed-out visitors), writable by
-- admins only. This is what makes the admin console's hide/edit real.
drop policy if exists hospitals_public_read on public.hospitals;
create policy hospitals_public_read on public.hospitals
  for select using (not hidden or public.is_admin());

drop policy if exists hospitals_admin_write on public.hospitals;
create policy hospitals_admin_write on public.hospitals
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists doctors_public_read on public.doctors;
create policy doctors_public_read on public.doctors
  for select using (not hidden or public.is_admin());

drop policy if exists doctors_admin_write on public.doctors;
create policy doctors_admin_write on public.doctors
  for all using (public.is_admin()) with check (public.is_admin());

-- Reports: you may file one and read your own. Staff and admin read all —
-- that is the whole point of the support console.
drop policy if exists reports_insert on public.reports;
create policy reports_insert on public.reports
  for insert with check (user_id = auth.uid() or user_id is null);

drop policy if exists reports_read on public.reports;
create policy reports_read on public.reports
  for select using (user_id = auth.uid() or public.current_role() in ('staff','admin'));

drop policy if exists reports_staff_update on public.reports;
create policy reports_staff_update on public.reports
  for update using (public.current_role() in ('staff','admin'));

-- Audit log: admins read; only the server writes (no client insert policy).
drop policy if exists audit_admin_read on public.audit_log;
create policy audit_admin_read on public.audit_log
  for select using (public.is_admin());
