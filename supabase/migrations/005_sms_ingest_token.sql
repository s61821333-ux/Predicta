-- Run after 002_schema.sql

alter table public.user_settings
  add column if not exists sms_ingest_token uuid;

update public.user_settings
set sms_ingest_token = gen_random_uuid()
where sms_ingest_token is null;

alter table public.user_settings
  alter column sms_ingest_token set default gen_random_uuid();

alter table public.user_settings
  alter column sms_ingest_token set not null;

create unique index if not exists user_settings_sms_ingest_token_idx
  on public.user_settings (sms_ingest_token);
