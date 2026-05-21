alter table subscribers add column if not exists status text not null default 'active';
alter table subscribers add column if not exists unsubscribe_token text not null default encode(gen_random_bytes(18), 'hex');

update subscribers
set unsubscribe_token = encode(gen_random_bytes(18), 'hex')
where unsubscribe_token is null or unsubscribe_token = '';

create index if not exists subscribers_status_created_idx on subscribers(status, created_at desc);
