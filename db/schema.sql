create extension if not exists pgcrypto;

create type deal_category as enum (
  'ai_tools',
  'saas',
  'developer_tools',
  'cloud_credits',
  'hosting'
);

create type deal_status as enum (
  'draft',
  'auto_published',
  'needs_review',
  'rejected',
  'expired'
);

create type source_type as enum (
  'official',
  'trusted_community',
  'open_web',
  'user_submission'
);

create table deals (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  product_name text not null,
  merchant text not null,
  category deal_category not null,
  original_price text,
  deal_price text,
  discount_summary text not null,
  region text not null default 'Global',
  expires_at timestamptz,
  source_url text not null,
  deal_url text not null,
  affiliate_url text,
  is_affiliate boolean not null default false,
  affiliate_network text,
  affiliate_program text,
  affiliate_status text not null default 'none',
  affiliate_notes text,
  source_type source_type not null,
  confidence_score integer not null check (confidence_score >= 0 and confidence_score <= 100),
  risk_tags text[] not null default '{}',
  ai_summary text not null,
  status deal_status not null default 'draft',
  last_checked_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table submissions (
  id uuid primary key default gen_random_uuid(),
  submitted_url text not null,
  submitter_email text,
  relationship text not null default 'reader',
  submitter_note text,
  generated_deal_id uuid references deals(id),
  status text not null default 'queued',
  created_at timestamptz not null default now()
);

create table subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  categories deal_category[] not null default '{}',
  source text not null default 'site',
  created_at timestamptz not null default now()
);

create table sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null unique,
  category deal_category not null,
  source_type source_type not null,
  auto_publish_threshold integer not null default 85,
  enabled boolean not null default true,
  last_checked_at timestamptz,
  created_at timestamptz not null default now()
);

create index deals_category_status_idx on deals(category, status);
create index deals_confidence_idx on deals(confidence_score desc);
create index deals_last_checked_idx on deals(last_checked_at desc);
create index sources_enabled_idx on sources(enabled);
