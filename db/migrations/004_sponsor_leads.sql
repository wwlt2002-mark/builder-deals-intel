create table if not exists sponsor_leads (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  contact_name text,
  email text not null,
  website text,
  offer_type text not null,
  budget text,
  message text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists sponsor_leads_status_created_idx on sponsor_leads(status, created_at desc);
