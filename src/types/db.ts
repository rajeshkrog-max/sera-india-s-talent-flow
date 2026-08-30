// SERA / YZI — schema types. Mirrors schema/0001_sera.sql exactly.

export type OrgType = "yzi" | "recruiter";
export type UserRole = "candidate" | "recruiter" | "admin";
export type AccountStatus = "active" | "inactive" | "blocked";
export type CandidateSource = "campaign_link" | "direct" | "referral" | "ad";
export type CandidateLock = "vacant" | "locked" | "yzi_internal" | "no_match" | "placed";
export type RequirementStatus = "new" | "pool_ok" | "pool_thin" | "campaign" | "filled";
export type CampaignWay = "from_req" | "yzi_internal";
export type CampaignStatus = "draft" | "running" | "ended";
export type HitTag = "cleared" | "no_email" | "dupe" | "junk";
export type SpecStatus = "pool" | "rejected" | "workflow";
export type WorkflowStep = "profile" | "meeting" | "docs" | "interview" | "offer" | "placed";
export type MessageSide = "recruiter" | "candidate";
export type IdentityRequestStatus = "pending" | "approved" | "rejected";

export type Json = Record<string, unknown>;

export type Org = { id: string; name: string; type: OrgType };

export type User = { id: string; org_id: string | null; role: UserRole; name: string; email: string | null; phone: string | null };

export type Candidate = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string | null;
  city: string | null;
  address: string | null;
  photo_url: string | null;
  company: string | null;
  title: string | null;
  field: string | null;
  expertise: string[];
  years: number | null;
  notice: string | null;
  current_ctc: string | null;
  expected_ctc: string | null;
  about: string | null;
  cv_url: string | null;
  account_status: AccountStatus;
  /** Origin never changes. */
  source: CandidateSource;
  campaign_id: string | null;
  origin_req_id: string | null;
  /** Lock changes on Send spec / Apply. */
  lock: CandidateLock;
  locked_spec_id: string | null;
};

export type Requirement = {
  id: string;
  org_id: string;
  recruiter_user_id: string;
  code: string;
  role: string;
  field: string | null;
  city: string | null;
  mode: string | null;
  filed_on: string;
  exp: string | null;
  ctc: string | null;
  notice: string | null;
  floor: string | null;
  heads: number;
  skills: string[];
  status: RequirementStatus;
  form: Json;
};

export type Campaign = {
  id: string;
  org_id: string;
  req_id: string | null;
  way: CampaignWay;
  name: string;
  status: CampaignStatus;
  brief: Json;
  portals: string[];
  start_on: string | null;
  end_on: string | null;
  target_count: number;
  extracted_count: number;
  shortlisted_count: number;
};

export type Hit = {
  id: string;
  campaign_id: string;
  candidate_id: string | null;
  portal: string | null;
  extracted: Json;
  tag: HitTag;
  score: number | null;
  mailed_at: string | null;
};

/** Email 1 link. Signup reads token; candidate UI never shows the campaign name. */
export type InviteToken = { id: string; token: string; campaign_id: string | null; req_id: string | null; email: string | null; used_at: string | null };

/** snapshot never contains phone / email / address. */
export type Spec = {
  id: string;
  req_id: string;
  recruiter_org_id: string;
  recruiter_user_id: string;
  candidate_id: string;
  snapshot: Json;
  status: SpecStatus;
};

export type Workflow = { id: string; spec_id: string; step: WorkflowStep; updated_at: string };

export type Message = {
  id: string;
  admin_id: string;
  side: MessageSide;
  recruiter_id: string | null;
  candidate_id: string | null;
  req_id: string | null;
  body: string;
  created_at: string;
};

export type Document = { id: string; candidate_id: string; name: string; url: string; kind: DocumentKind; shared_spec_id: string | null };

export type IdentityRequest = {
  id: string;
  candidate_id: string;
  field: string;
  from_value: string | null;
  to_value: string | null;
  reason: string | null;
  status: IdentityRequestStatus;
  reviewed_at: string | null;
};

/** INSERT ONLY. meta for send_spec must include recruiter_name, recruiter_org, req_code. */
export type AuditEvent = {
  id: string;
  actor_id: string;
  action: string;
  subject_type: string;
  subject_id: string | null;
  meta: Json;
  ip: string | null;
  created_at: string;
};

export type SendSpecAuditMeta = { recruiter_name: string; recruiter_org: string; req_code: string };

// ---------- Candidate portal ----------

export type DocumentKind = "resume" | "cv" | "pan" | "aadhaar" | "voter_id" | "company_id" | "payslip" | "other";
export type FeedbackAbout = "yzi" | "employer";
export type FeedbackStatus = "under_review" | "accepted";
export type JobInviteStatus = "shown" | "applied" | "rejected";

export type Feedback = {
  id: string;
  candidate_id: string;
  about: FeedbackAbout;
  employer_name: string | null;
  body: string;
  status: FeedbackStatus;
  admin_note: string | null;
  created_at: string;
  reviewed_at: string | null;
};

/** Ask Sera — candidate raises a problem at a milestone. */
export type Grievance = { id: string; candidate_id: string; req_id: string; milestone: WorkflowStep; body: string; created_at: string };

/** summary never contains recruiter or agency name. */
export type JobInvite = { id: string; candidate_id: string; req_id: string; role: string; city: string | null; summary: Json; status: JobInviteStatus };
