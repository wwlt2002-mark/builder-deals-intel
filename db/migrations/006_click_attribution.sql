alter table outbound_clicks add column if not exists placement text not null default 'unknown';
alter table outbound_clicks add column if not exists campaign text;

create index if not exists outbound_clicks_placement_created_idx on outbound_clicks(placement, created_at desc);
