create table if not exists affiliate_program_applications (
  program_id text primary key,
  program_name text not null,
  pipeline_status text not null default 'planned',
  approved_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists affiliate_program_applications_status_idx
on affiliate_program_applications(pipeline_status, updated_at desc);
