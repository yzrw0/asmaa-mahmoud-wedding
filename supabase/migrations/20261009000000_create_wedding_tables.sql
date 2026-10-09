create extension if not exists pgcrypto;

create table if not exists public.wedding_messages (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null check (char_length(guest_name) between 1 and 100),
  message text not null check (char_length(message) between 1 and 1200),
  created_at timestamptz not null default now()
);

alter table public.wedding_messages enable row level security;

revoke all on table public.wedding_messages from anon, authenticated;
grant insert on table public.wedding_messages to anon, authenticated;

create policy "guests may leave private messages"
on public.wedding_messages for insert
to anon, authenticated
with check (true);

comment on table public.wedding_messages is 'Private notes for the couple. No public SELECT policy.';
