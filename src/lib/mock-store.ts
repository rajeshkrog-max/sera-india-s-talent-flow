import { useSyncExternalStore } from "react";

export type Portal = "candidate" | "recruiter" | "admin";
export type CandidateStatus = "pool" | "review" | "workflow" | "placed";

export type Candidate = {
  id: string;
  name: string;
  initials: string;
  stack: string;
  city: string;
  requirement: string;
  origin: string;
  years: string;
  status: CandidateStatus;
  accepted: boolean;
  email: string;
  phone: string;
};

export const candidates: Candidate[] = [
  { id: "CAND-0417", name: "Rahul Mehta", initials: "RM", stack: ".NET", city: "Bengaluru", requirement: "REQ-104", origin: "YZI pool", years: "3.2 yrs", status: "pool", accepted: false, email: "rahul.mehta@example.com", phone: "+91 98765 43210" },
  { id: "CAND-0392", name: "Neha Joshi", initials: "NJ", stack: "React", city: "Pune", requirement: "REQ-201", origin: "campaign Java Pune", years: "5 yrs", status: "review", accepted: false, email: "neha.joshi@example.com", phone: "+91 98200 11223" },
  { id: "CAND-0501", name: "Ananya Rao", initials: "AR", stack: ".NET", city: "Hyderabad", requirement: "REQ-104", origin: "YZI pool", years: "4.5 yrs", status: "workflow", accepted: true, email: "ananya.rao@example.com", phone: "+91 99123 44770" },
  { id: "CAND-0466", name: "Sana Kapoor", initials: "SK", stack: "React", city: "Pune", requirement: "REQ-201", origin: "campaign Java Pune", years: "4 yrs", status: "pool", accepted: false, email: "sana.kapoor@example.com", phone: "+91 98990 99121" },
  { id: "CAND-0321", name: "Kiran Nair", initials: "KN", stack: "React", city: "Kochi", requirement: "REQ-088", origin: "YZI pool", years: "6 yrs", status: "placed", accepted: true, email: "kiran.nair@example.com", phone: "+91 97450 20431" },
];

type StoreState = {
  acceptedRahul: boolean;
  selectedCandidateId: string;
  sentSpecs: string[];
  sharedDocs: string[];
  confirmedEmails: string[];
  messages: { from: string; text: string; time: string; unread?: boolean }[];
};

const initialState: StoreState = {
  acceptedRahul: false,
  selectedCandidateId: "CAND-0417",
  sentSpecs: ["CAND-0417"],
  sharedDocs: ["CAND-0321"],
  confirmedEmails: [],
  messages: [
    { from: "YZI Admin", text: "Your profile is ready for review against REQ-104.", time: "09:32", unread: true },
    { from: "YZI Admin", text: "Please upload your latest payslip when you have it.", time: "Yesterday" },
  ],
};

let state = initialState;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export const demoStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() {
    return state;
  },
  selectCandidate(id: string) {
    state = { ...state, selectedCandidateId: id };
    emit();
  },
  acceptRahul() {
    state = { ...state, acceptedRahul: true };
    emit();
  },
  sendSpec(id: string) {
    state = { ...state, sentSpecs: state.sentSpecs.includes(id) ? state.sentSpecs : [...state.sentSpecs, id] };
    emit();
  },
  shareDocs(id: string) {
    state = { ...state, sharedDocs: state.sharedDocs.includes(id) ? state.sharedDocs : [...state.sharedDocs, id] };
    emit();
  },
  confirmEmail(id: string) {
    state = { ...state, confirmedEmails: state.confirmedEmails.includes(id) ? state.confirmedEmails : [...state.confirmedEmails, id] };
    emit();
  },
};

export function useDemoStore() {
  return useSyncExternalStore(demoStore.subscribe, demoStore.getSnapshot, demoStore.getSnapshot);
}

export function getSelectedCandidate(id: string) {
  return candidates.find((candidate) => candidate.id === id) ?? candidates[0];
}
