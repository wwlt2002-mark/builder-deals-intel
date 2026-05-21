alter table deals add column if not exists affiliate_network text;
alter table deals add column if not exists affiliate_program text;
alter table deals add column if not exists affiliate_status text not null default 'none';
alter table deals add column if not exists affiliate_notes text;

update deals
set affiliate_status = case when is_affiliate then 'active' else 'none' end
where affiliate_status = 'none';
