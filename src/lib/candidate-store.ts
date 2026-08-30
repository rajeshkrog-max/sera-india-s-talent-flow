import { useSyncExternalStore } from "react";

export const candidateStages = ["Profile", "Review", "Sent", "Meeting", "Docs", "Interview", "Offer", "Placed"] as const;
export type CandidateStage = (typeof candidateStages)[number];

export type DocKind = "resume" | "cv" | "pan" | "aadhaar" | "voter_id" | "company_id" | "payslip" | "other";

export const docKindLabel: Record<DocKind, string> = {
  resume: "Resume",
  cv: "CV",
  pan: "PAN",
  aadhaar: "Aadhaar",
  voter_id: "Voter ID",
  company_id: "Company ID",
  payslip: "Payslip",
  other: "Other",
};

export type CandidateDoc = { id: string; kind: DocKind; name: string; uploadedAt: string };

export type JobInvite = {
  id: string;
  reqId: string;
  role: string;
  city: string;
  mode: string;
  notice: string;
  why: string;
  skills: string[];
  seraNote: string;
  status: "shown" | "applied" | "rejected";
  deadline: string;
  ctc: string;
  joiningLocation: string;
  accommodation: { provided: boolean; city?: string };
  experience: string;
  mustSkills: string[];
  niceSkills: string[];
  shiftBond: string;
  domain: string;
};

export type Grievance = { id: string; reqId: string; milestone: CandidateStage; body: string; createdAt: string };

export type FeedbackEntry = {
  id: string;
  about: "yzi" | "employer";
  employerName: string | null;
  body: string;
  status: "under_review" | "accepted";
  adminNote: string | null;
  createdAt: string;
};

export type CandidateProfile = {
  identity: { name: string; phone: string; email: string; city: string; address: string };
  accountStatus: "active" | "inactive" | "blocked";
  work: { company: string; title: string; field: string; years: string; notice: string; currentCtc: string; expectedCtc: string }[];
  expertise: string[];
  about: string;
};

type State = {
  stepIndex: number;
  stepDates: Partial<Record<CandidateStage, string>>;
  stepAgeDays: Partial<Record<CandidateStage, number>>;
  docs: CandidateDoc[];
  invites: JobInvite[];
  grievances: Grievance[];
  feedback: FeedbackEntry[];
  profile: CandidateProfile;
  identityRequests: { field: string; reason: string; status: "pending" }[];
};

const now = () => new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

let state: State = {
  stepIndex: 1,
  stepDates: { Profile: "12 Aug 2026, 10:04", Review: "24 Aug 2026, 16:20" },
  stepAgeDays: { Review: 23 },
  docs: [
    { id: "DOC-1", kind: "resume", name: "arjun-resume.pdf", uploadedAt: "12 Aug 2026" },
    { id: "DOC-2", kind: "aadhaar", name: "aadhaar-front.pdf", uploadedAt: "12 Aug 2026" },
  ],
  invites: [
    {
      id: "JIN-1",
      reqId: "REQ-104",
      role: "Senior .NET Engineer",
      city: "Bengaluru",
      mode: "Hybrid · 3 days office",
      notice: "30 days preferred",
      why: "Your .NET + Azure delivery record matches this brief closely.",
      skills: [".NET", "Azure", "ASP.NET Core", "Microservices"],
      seraNote: "Sera scored 94% on stack, city and notice period.",
      status: "shown",
      deadline: "12 Sep 2026",
      ctc: "₹22–28 LPA",
      joiningLocation: "Bengaluru · Outer Ring Road",
      accommodation: { provided: false },
      experience: "5–8 years",
      mustSkills: [".NET 8", "ASP.NET Core", "Azure", "SQL Server"],
      niceSkills: ["Kubernetes", "Event-driven design", "Blazor"],
      shiftBond: "General shift · No bond",
      domain: "Product · Fintech · 200–500 people",
    },
    {
      id: "JIN-2",
      reqId: "REQ-118",
      role: "Backend Engineer · Payments",
      city: "Bengaluru",
      mode: "On-site",
      notice: "45 days",
      why: "Payments domain overlap with your current billing platform work.",
      skills: [".NET", "SQL Server", "Kafka"],
      seraNote: "Sera scored 88%. Slightly higher experience band.",
      status: "shown",
      deadline: "18 Sep 2026",
      ctc: "₹26–32 LPA",
      joiningLocation: "Bengaluru · Whitefield",
      accommodation: { provided: true, city: "Bengaluru" },
      experience: "6–9 years",
      mustSkills: [".NET", "SQL Server", "Payment flows"],
      niceSkills: ["Kafka", "PCI-DSS exposure", "Redis"],
      shiftBond: "Rotational on-call · 1-year service agreement",
      domain: "Product · Payments · 500–1000 people",
    },
    {
      id: "JIN-3",
      reqId: "REQ-127",
      role: "Platform Engineer",
      city: "Pune",
      mode: "Remote-first",
      notice: "Immediate to 30 days",
      why: "Cloud infrastructure exposure and microservice ownership.",
      skills: ["Azure", "Docker", "CI/CD"],
      seraNote: "Sera scored 81%. Relocation optional.",
      deadline: "30 Sep 2026",
      ctc: "₹18–24 LPA",
      joiningLocation: "Pune · Baner (optional)",
      accommodation: { provided: false },
      experience: "4–7 years",
      mustSkills: ["Azure", "Docker", "CI/CD pipelines"],
      niceSkills: ["Terraform", "Observability stack", "Go"],
      shiftBond: "Flexible hours · No bond",
      domain: "SaaS · DevTools · 50–200 people",
      status: "shown",
    },
  ],
  grievances: [],
  feedback: [],
  profile: {
    identity: { name: "Arjun Kapoor", phone: "+91 98765 43210", email: "arjun.kapoor@example.com", city: "Bengaluru", address: "14, Indiranagar 2nd Stage, Bengaluru 560038" },
    accountStatus: "active",
    work: [{ company: "Northline Systems", title: "Senior Software Engineer", field: "Engineering", years: "3.2", notice: "30 days", currentCtc: "18 LPA", expectedCtc: "26 LPA" }],
    expertise: [".NET", "Azure", "ASP.NET Core", "Microservices"],
    about: "Backend engineer building billing and identity services on .NET and Azure.",
  },
  identityRequests: [],
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());
const set = (next: Partial<State>) => {
  state = { ...state, ...next };
  emit();
};

let counter = 0;
const nextId = (prefix: string) => `${prefix}-${++counter}${Date.now().toString().slice(-4)}`;

export const candidateStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() {
    return state;
  },
  addDoc(kind: DocKind, name: string) {
    set({ docs: [...state.docs, { id: nextId("DOC"), kind, name, uploadedAt: now() }] });
  },
  applyInvite(id: string) {
    const invite = state.invites.find((item) => item.id === id);
    set({ invites: state.invites.map((item) => (item.id === id ? { ...item, status: "applied" } : item)) });
    return invite;
  },
  sendSpec(reqId: string) {
    set({ stepIndex: Math.max(state.stepIndex, 2), stepDates: { ...state.stepDates, Sent: now() }, stepAgeDays: { ...state.stepAgeDays, Sent: 0 } });
    return reqId;
  },
  rejectInvite(id: string) {
    set({ invites: state.invites.map((item) => (item.id === id ? { ...item, status: "rejected" } : item)) });
  },
  addGrievance(milestone: CandidateStage, body: string, reqId: string) {
    set({ grievances: [{ id: nextId("GRV"), reqId, milestone, body, createdAt: now() }, ...state.grievances] });
  },
  addFeedback(about: "yzi" | "employer", employerName: string | null, body: string) {
    set({ feedback: [{ id: nextId("FBK"), about, employerName, body, status: "under_review", adminNote: null, createdAt: now() }, ...state.feedback] });
  },
  acceptFeedback(id: string, adminNote: string) {
    set({ feedback: state.feedback.map((item) => (item.id === id ? { ...item, status: "accepted", adminNote } : item)) });
  },
  saveWork(work: CandidateProfile["work"], expertise: string[], about: string) {
    set({ profile: { ...state.profile, work, expertise, about } });
  },
  requestIdentityChange(field: string, reason: string) {
    set({ identityRequests: [...state.identityRequests, { field, reason, status: "pending" }] });
  },
};

export function useCandidateStore() {
  return useSyncExternalStore(candidateStore.subscribe, candidateStore.getSnapshot, candidateStore.getSnapshot);
}
