-- SERA / YZI — schema file only (no live database in this step).
-- Intended path: supabase/migrations/0001_sera.sql (that folder is tool-managed, so the
-- canonical source of truth lives here until migrations are actually run).

create type org_type as enum ('yzi', 'recruiter');
create type user_role as enum ('candidate', 'recruiter', 'admin');
create type account_status as enum ('active', 'inactive', 'blocked');
create type candidate_source as enum ('campaign_link', 'direct', 'referral', 'ad');
create type candidate_lock as enum ('vacant', 'locked', 'yzi_internal', 'no_match', 'placed');
create type requirement_status as enum ('new', 'pool_ok', 'pool_thin', 'campaign', 'filled');
create type campaign_way as enum ('from_req', 'yzi_internal');
create type campaign_status as enum ('draft', 'running', 'ended');
create type hit_tag as enum ('cleared', 'no_email', 'dupe', 'junk');
create type spec_status as enum ('pool', 'rejected', 'workflow');
create type workflow_step as enum ('profile', 'meeting', 'docs', 'interview', 'offer', 'placed');
create type message_side as enum ('recruiter', 'candidate');
create type identity_request_status as enum ('pending', 'approved', 'rejected');

create table public.orgs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type org_type not null
);

create table public.users (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.orgs(id) on delete set null,
  role user_role not null,
  name text not null,
  email text,
  phone text
);

create table public.candidates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  phone text,
  email text,
  city text,
  address text,
  photo_url text,
  company text,
  title text,
  field text,
  expertise text[] not null default '{}',
  years numeric,
  notice text,
  current_ctc text,
  expected_ctc text,
  about text,
  cv_url text,
  account_status account_status not null default 'active',
  source candidate_source not null default 'direct',
  campaign_id uuid,
  origin_req_id uuid,
  lock candidate_lock not null default 'vacant',
  locked_spec_id uuid
);

create table public.requirements (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  recruiter_user_id uuid not null references public.users(id) on delete cascade,
  code text not null unique,
  role text not null,
  field text,
  city text,
  mode text,
  filed_on date not null default current_date,
  exp text,
  ctc text,
  notice text,
  floor text,
  heads int not null default 1,
  skills text[] not null default '{}',
  status requirement_status not null default 'new',
  form jsonb not null default '{}'::jsonb
);

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  req_id uuid references public.requirements(id) on delete set null,
  way campaign_way not null,
  name text not null,
  status campaign_status not null default 'draft',
  brief jsonb not null default '{}'::jsonb,
  portals text[] not null default '{}',
  start_on date,
  end_on date,
  target_count int not null default 0,
  extracted_count int not null default 0,
  shortlisted_count int not null default 0
);

create table public.hits (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  candidate_id uuid references public.candidates(id) on delete set null,
  portal text,
  extracted jsonb not null default '{}'::jsonb,
  tag hit_tag not null default 'cleared',
  score numeric,
  mailed_at timestamptz
);

-- Email 1 link. Signup reads token, sets source=campaign_link, campaign_id, origin_req_id.
-- Candidate UI never shows the campaign name.
create table public.invite_tokens (
  id uuid primary key default gen_random_uuid(),
  token text not null unique,
  campaign_id uuid references public.campaigns(id) on delete cascade,
  req_id uuid references public.requirements(id) on delete set null,
  email text,
  used_at timestamptz
);

-- snapshot NEVER contains phone / email / address.
create table public.specs (
  id uuid primary key default gen_random_uuid(),
  req_id uuid not null references public.requirements(id) on delete cascade,
  recruiter_org_id uuid not null references public.orgs(id) on delete cascade,
  recruiter_user_id uuid not null references public.users(id) on delete cascade,
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  snapshot jsonb not null default '{}'::jsonb,
  status spec_status not null default 'pool'
);

create table public.workflows (
  id uuid primary key default gen_random_uuid(),
  spec_id uuid not null references public.specs(id) on delete cascade,
  step workflow_step not null default 'profile'
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.users(id) on delete cascade,
  side message_side not null,
  recruiter_id uuid references public.users(id) on delete set null,
  candidate_id uuid references public.candidates(id) on delete set null,
  req_id uuid references public.requirements(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  name text not null,
  url text not null,
  shared_spec_id uuid references public.specs(id) on delete set null
);

create table public.identity_requests (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  field text not null,
  from_value text,
  to_value text,
  reason text,
  status identity_request_status not null default 'pending',
  reviewed_at timestamptz
);

-- INSERT ONLY. meta for send_spec MUST include recruiter_name, recruiter_org, req_code.
create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references public.users(id) on delete restrict,
  action text not null,
  subject_type text not null,
  subject_id uuid,
  meta jsonb not null default '{}'::jsonb,
  ip inet,
  created_at timestamptz not null default now()
);

create rule audit_events_no_update as on update to public.audit_events do instead nothing;
create rule audit_events_no_delete as on delete to public.audit_events do instead nothing;

grant select, insert, update, delete on public.orgs, public.users, public.candidates,
  public.requirements, public.campaigns, public.hits, public.invite_tokens, public.specs,
  public.workflows, public.messages, public.documents, public.identity_requests to authenticated;
grant select, insert on public.audit_events to authenticated;
grant all on public.orgs, public.users, public.candidates, public.requirements, public.campaigns,
  public.hits, public.invite_tokens, public.specs, public.workflows, public.messages,
  public.documents, public.identity_requests, public.audit_events to service_role;

alter table public.orgs enable row level security;
alter table public.users enable row level security;
alter table public.candidates enable row level security;
alter table public.requirements enable row level security;
alter table public.campaigns enable row level security;
alter table public.hits enable row level security;
alter table public.invite_tokens enable row level security;
alter table public.specs enable row level security;
alter table public.workflows enable row level security;
alter table public.messages enable row level security;
alter table public.documents enable row level security;
alter table public.identity_requests enable row level security;
alter table public.audit_events enable row level security;

-- ============================================================
-- Candidate portal additions
-- ============================================================

create type document_kind as enum ('resume', 'cv', 'pan', 'aadhaar', 'voter_id', 'company_id', 'payslip', 'other');
create type feedback_about as enum ('yzi', 'employer');
create type feedback_status as enum ('under_review', 'accepted');
create type job_invite_status as enum ('shown', 'applied', 'rejected');

-- Every uploaded file carries a type. No untyped documents.
alter table public.documents add column kind document_kind not null default 'other';

-- Progress dates for each workflow step.
alter table public.workflows add column updated_at timestamptz not null default now();

create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  about feedback_about not null,
  employer_name text,
  body text not null,
  status feedback_status not null default 'under_review',
  admin_note text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

-- Ask Sera: candidate raises a problem at a milestone.
create table public.grievances (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  req_id uuid not null references public.requirements(id) on delete cascade,
  milestone workflow_step not null,
  body text not null,
  created_at timestamptz not null default now()
);

-- summary NEVER contains recruiter or agency name.
create table public.job_invites (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  req_id uuid not null references public.requirements(id) on delete cascade,
  role text not null,
  city text,
  summary jsonb not null default '{}'::jsonb,
  status job_invite_status not null default 'shown'
);

grant select, insert, update, delete on public.feedback, public.grievances, public.job_invites to authenticated;
grant all on public.feedback, public.grievances, public.job_invites to service_role;

alter table public.feedback enable row level security;
alter table public.grievances enable row level security;
alter table public.job_invites enable row level security;
