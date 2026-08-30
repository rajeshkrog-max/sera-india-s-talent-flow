export type PoolColumn = "Pool" | "Sent" | "Interview" | "Offer" | "Placed" | "No match";

/** Origin never changes. Lock changes on Send spec / Apply. */
export type LockState = "vacant" | "locked" | "yzi_internal" | "no_match" | "placed";
export type OriginSource = "campaign_link" | "direct" | "referral" | "ad";

export type AdminPerson = {
  id: string;
  name: string;
  initials: string;
  column: PoolColumn;
  requirement: string;
  stack: string;
  /** Admin-only origin line. Never shown to the candidate. */
  source: OriginSource;
  originCampaign?: string;
  lock: LockState;
  lockedRecruiter?: string;
  lockedAgency?: string;
  city: string;
  experience: string;
  ctc: string;
  notice: string;
  email: string;
  phone: string;
  skills: string[];
  matchReason: string;
  seraNote: string;
  step: string;
  offerStatus?: string;
  placement?: { package: string; terms: string; placedDate: string; auditRef: string };
};

export const adminPool: AdminPerson[] = [
  { id: "CAND-0417", name: "Rahul Mehta", initials: "RM", column: "Pool", requirement: "REQ-104", stack: ".NET", source: "direct", lock: "vacant", city: "Bengaluru", experience: "3.2 yrs", ctc: "₹14.5 LPA → ₹19 LPA", notice: "30 days", email: "rahul.mehta@example.com", phone: "+91 98765 43210", skills: [".NET", "C#", "Azure", "SQL Server"], matchReason: "Stack, city and CTC band all sit inside REQ-104. Verified work history at two product firms.", seraNote: "Sera ranked Rahul first on REQ-104: 92% skill overlap, same city, notice inside the client window.", step: "Review" },
  { id: "CAND-0466", name: "Sana Kapoor", initials: "SK", column: "Pool", requirement: "REQ-201", stack: "React", source: "campaign_link", originCampaign: "CMP-012 · Java Pune", lock: "vacant", city: "Pune", experience: "4 yrs", ctc: "₹16 LPA → ₹21 LPA", notice: "60 days", email: "sana.kapoor@example.com", phone: "+91 98990 99121", skills: ["React", "TypeScript", "Next.js"], matchReason: "React depth plus Pune availability against a pool-thin requirement.", seraNote: "Sera flagged Sana as the strongest campaign extract for REQ-201.", step: "Review" },
  { id: "CAND-0392", name: "Neha Joshi", initials: "NJ", column: "Sent", requirement: "REQ-201", stack: "React", source: "campaign_link", originCampaign: "CMP-012 · Java Pune", lock: "locked", lockedRecruiter: "Priya Shah", lockedAgency: "Eventrics", city: "Pune", experience: "5 yrs", ctc: "₹18 LPA → ₹24 LPA", notice: "45 days", email: "neha.joshi@example.com", phone: "+91 98200 11223", skills: ["React", "Redux", "Node", "GraphQL"], matchReason: "Five years of front-end delivery, Pune based, email verified in the campaign extract.", seraNote: "Spec already with Eventrics. Contact stayed with YZI.", step: "Sent" },
  { id: "CAND-0501", name: "Ananya Rao", initials: "AR", column: "Interview", requirement: "REQ-104", stack: ".NET", source: "direct", lock: "locked", lockedRecruiter: "Priya Shah", lockedAgency: "Eventrics", city: "Hyderabad", experience: "4.5 yrs", ctc: "₹17 LPA → ₹23 LPA", notice: "Immediate", email: "ananya.rao@example.com", phone: "+91 99123 44770", skills: [".NET", "Azure", "Microservices", "Kafka"], matchReason: "Microservices depth on Azure, immediate joiner, already reviewed by the hiring desk.", seraNote: "Docs step reached — payslips and offer letter waiting on YZI release.", step: "Docs" },
  { id: "CAND-0288", name: "Vikram Sethi", initials: "VS", column: "Offer", requirement: "REQ-104", stack: ".NET", source: "referral", lock: "locked", lockedRecruiter: "Priya Shah", lockedAgency: "Eventrics", city: "Bengaluru", experience: "7 yrs", ctc: "₹26 LPA → ₹32 LPA", notice: "90 days", email: "vikram.sethi@example.com", phone: "+91 90080 55412", skills: [".NET", "Azure", "Team lead"], matchReason: "Lead-level experience for the senior band on REQ-104.", seraNote: "Offer under negotiation. Notice period is the only open risk.", step: "Offer", offerStatus: "Offer released 28 Aug 2026 · awaiting candidate signature" },
  { id: "CAND-0321", name: "Kiran Nair", initials: "KN", column: "Placed", requirement: "REQ-088", stack: "React", source: "direct", lock: "placed", lockedRecruiter: "Meera Iyer", lockedAgency: "Northline", city: "Kochi", experience: "6 yrs", ctc: "₹22 LPA → ₹28 LPA", notice: "Joined", email: "kiran.nair@example.com", phone: "+91 97450 20431", skills: ["React", "Design systems"], matchReason: "Placed on REQ-088 after a two-stage interview loop.", seraNote: "Placement closed. Documents archived in the audit trail.", step: "Placed", placement: { package: "₹28 LPA fixed + ₹2 LPA variable", terms: "Fee 8.33% of annual CTC · 90-day replacement guarantee", placedDate: "12 Aug 2026", auditRef: "AUD-2291" } },
  { id: "CAND-0455", name: "Imran Sheikh", initials: "IS", column: "No match", requirement: "REQ-201", stack: "Angular", source: "campaign_link", originCampaign: "CMP-012 · Java Pune", lock: "no_match", city: "Nagpur", experience: "2 yrs", ctc: "₹9 LPA → ₹12 LPA", notice: "15 days", email: "imran.sheikh@example.com", phone: "+91 96543 77120", skills: ["Angular", "RxJS"], matchReason: "Stack mismatch against the React requirement.", seraNote: "Sera parked Imran for future Angular requirements. Not sent to any desk.", step: "Review" },
];

export const poolColumns: PoolColumn[] = ["Pool", "Sent", "Interview", "Offer", "Placed", "No match"];

export function originLine(person: AdminPerson) {
  if (person.source === "campaign_link" && person.originCampaign) return `Came from Email 1 · ${person.originCampaign}`;
  if (person.source === "referral") return "Referral signup";
  if (person.source === "ad") return "Ad signup";
  return "Direct signup";
}

export function lockChip(person: AdminPerson) {
  if (person.lock === "placed") return "Placed";
  if (person.lock === "no_match") return "No match";
  if (person.lock === "yzi_internal") return "YZI in-house";
  if (person.lock === "locked") return `Locked · ${person.lockedRecruiter} · ${person.lockedAgency}`;
  return "Vacant";
}

export type AdminCampaign = {
  id: string;
  name: string;
  city: string;
  status: "RUNNING" | "ENDED" | "DRAFT";
  way: "from_req" | "yzi_internal";
  reqId?: string;
  dates: string;
  hitIds: string[];
  brief: string;
  targetCount: number;
  extractedCount: number;
  shortlistedCount: number;
  mailedIds: string[];
};

export const adminCampaigns: AdminCampaign[] = [
  { id: "CMP-012", name: "Java Pune", city: "Pune", status: "RUNNING", way: "from_req", reqId: "REQ-201", dates: "18 Aug — 18 Sep 2026", hitIds: ["CAND-0392", "CAND-0466", "CAND-0455", "CAND-0417"], brief: "React / Java engineers, Pune, 3–6 yrs, verified email required, house pool excluded.", targetCount: 42, extractedCount: 26, shortlistedCount: 8, mailedIds: ["CAND-0392"] },
  { id: "CMP-014", name: "Go Bengaluru", city: "Bengaluru", status: "DRAFT", way: "yzi_internal", dates: "Brief in edit", hitIds: [], brief: "Drafted in-house. Needs CTC band, portals and dates before start.", targetCount: 30, extractedCount: 0, shortlistedCount: 0, mailedIds: [] },
  { id: "CMP-009", name: "React Delhi", city: "Delhi", status: "ENDED", way: "from_req", reqId: "REQ-088", dates: "01 Jul — 31 Jul 2026", hitIds: ["CAND-0321", "CAND-0288"], brief: "Closed campaign. 86 extracted, 2 placed.", targetCount: 80, extractedCount: 86, shortlistedCount: 12, mailedIds: ["CAND-0321", "CAND-0288"] },
];

export type ReqStatus = "pool_ok" | "pool_thin" | "in_workflow" | "filled";

export type AdminRequirement = {
  id: string;
  role: string;
  city: string;
  recruiter: string;
  agency: string;
  filed: string;
  status: ReqStatus;
  matchIds: string[];
  exp: string;
  ctc: string;
  notice: string;
  skills: string[];
  heads: number;
  /** Public open role — the only campaign-free label a candidate may see. */
  publicRole: boolean;
};

export const reqStatusLabel: Record<ReqStatus, string> = {
  pool_ok: "Pool matched",
  pool_thin: "Pool thin",
  in_workflow: "In workflow",
  filled: "Filled",
};

export const adminRequirements: AdminRequirement[] = [
  { id: "REQ-104", role: "Senior .NET Engineer", city: "Bengaluru", recruiter: "Priya Shah", agency: "Eventrics", filed: "26 Aug 2026", status: "pool_ok", matchIds: ["CAND-0417", "CAND-0501", "CAND-0288"], exp: "5 – 8 years", ctc: "₹18 – ₹28 LPA", notice: "Up to 60 days", skills: [".NET", "Azure", "Microservices"], heads: 2, publicRole: true },
  { id: "REQ-201", role: "React Engineer", city: "Pune", recruiter: "Priya Shah", agency: "Eventrics", filed: "24 Aug 2026", status: "pool_thin", matchIds: ["CAND-0392", "CAND-0466", "CAND-0455"], exp: "3 – 6 years", ctc: "₹16 – ₹24 LPA", notice: "Up to 45 days", skills: ["React", "TypeScript", "Node"], heads: 3, publicRole: true },
  { id: "REQ-088", role: "Product Designer", city: "Mumbai", recruiter: "Meera Iyer", agency: "Northline", filed: "21 Aug 2026", status: "in_workflow", matchIds: ["CAND-0321"], exp: "4 – 7 years", ctc: "₹20 – ₹30 LPA", notice: "Immediate", skills: ["Figma", "Design systems"], heads: 1, publicRole: false },
];

/** Public open roles for independent candidate signup. Never a campaign name. */
export const publicOpenRoles = adminRequirements
  .filter((item) => item.publicRole)
  .map((item) => ({ reqId: item.id, label: `${item.role} · ${item.city}` }));

export type AdminApproval = {
  id: string;
  kind: "identity" | "recruiter_ask" | "campaign_draft";
  title: string;
  subject: string;
  meta: string;
  detail: { label: string; value: string }[];
  body: string;
};

export const adminApprovals: AdminApproval[] = [
  { id: "APR-1", kind: "identity", title: "Identity request", subject: "Kiran Nair", meta: "CAND-0321 · legal name", detail: [{ label: "FIELD", value: "Legal name" }, { label: "OLD", value: "Kiran Nair" }, { label: "NEW", value: "Kiran Nair Menon" }, { label: "REASON", value: "Name updated on passport after marriage." }], body: "Approving updates the locked identity record and writes one audit row." },
  { id: "APR-2", kind: "recruiter_ask", title: "Recruiter ask", subject: "Priya Shah · Eventrics", meta: "REQ-104 · pass to candidate", detail: [{ label: "FROM", value: "Priya Shah · Eventrics" }, { label: "REQUIREMENT", value: "REQ-104 · Senior .NET Engineer" }, { label: "ASK", value: "Can the candidate attend an on-site loop on 4 Sep?" }], body: "YZI relays the question. The recruiter never reaches the candidate directly." },
  { id: "APR-3", kind: "campaign_draft", title: "Campaign draft", subject: "Go Bengaluru", meta: "CMP-014 · brief review", detail: [{ label: "ROLE", value: "Senior Go Engineer" }, { label: "CITY", value: "Bengaluru" }, { label: "BRIEF", value: "In-house campaign, 30 targets, verified emails only." }, { label: "PORTALS", value: "Portal A · Referral network" }], body: "Confirming releases the draft brief to Sera for extraction." },
];

export type AdminThread = { id: string; side: "recruiter" | "candidate"; title: string; meta: string; unread: number; messages: { from: "YZI Admin" | string; text: string; time: string }[] };

export const adminThreads: AdminThread[] = [
  { id: "TH-1", side: "recruiter", title: "Priya Shah · Eventrics", meta: "REQ-104 · .NET Bengaluru", unread: 1, messages: [
    { from: "Priya Shah", text: "Any movement on the .NET shortlist? We can interview this week.", time: "09:18" },
    { from: "YZI Admin", text: "Spec for one profile is with you. Two more clear review today.", time: "09:26" },
    { from: "Priya Shah", text: "Perfect. Send them as soon as they clear.", time: "09:31" },
  ] },
  { id: "TH-2", side: "recruiter", title: "Priya Shah · Eventrics", meta: "REQ-201 · React Pune", unread: 0, messages: [
    { from: "Priya Shah", text: "Pool looks thin on REQ-201.", time: "Yesterday" },
    { from: "YZI Admin", text: "Sourcing is running. First extracts land tomorrow.", time: "Yesterday" },
  ] },
  { id: "TH-3", side: "recruiter", title: "Meera Iyer · Northline", meta: "REQ-088 · Design Mumbai", unread: 0, messages: [
    { from: "Meera Iyer", text: "Kiran joined on Monday. Thank you.", time: "Mon" },
    { from: "YZI Admin", text: "Noted and closed on our side.", time: "Mon" },
  ] },
  { id: "TH-4", side: "candidate", title: "Rahul Mehta", meta: "CAND-0417 · REQ-104", unread: 1, messages: [
    { from: "YZI Admin", text: "Your profile is ready for review against REQ-104.", time: "09:32" },
    { from: "Rahul Mehta", text: "Great — should I upload the latest payslip?", time: "09:40" },
  ] },
  { id: "TH-5", side: "candidate", title: "Ananya Rao", meta: "CAND-0501 · REQ-104", unread: 0, messages: [
    { from: "YZI Admin", text: "Documents requested by the hiring desk. We share only what is needed.", time: "08:55" },
    { from: "Ananya Rao", text: "Uploaded. Let me know if anything is missing.", time: "09:02" },
  ] },
  { id: "TH-6", side: "candidate", title: "Kiran Nair", meta: "CAND-0321 · REQ-088", unread: 0, messages: [
    { from: "Kiran Nair", text: "Requesting a legal name update on my identity.", time: "Yesterday" },
    { from: "YZI Admin", text: "Request logged for approval.", time: "Yesterday" },
  ] },
];

export function findPerson(id: string) {
  return adminPool.find((person) => person.id === id);
}

export function findRequirement(id: string) {
  return adminRequirements.find((item) => item.id === id);
}
