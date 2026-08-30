import { useSyncExternalStore } from "react";

export type RecruiterRequirementForm = {
  role: string;
  field: string;
  city: string;
  mode: "WFO" | "Hybrid" | "WFH";
  joiningLocation: string;
  accommodation: "yes" | "no";
  exp: string;
  ctc: string;
  notice: string;
  heads: string;
  mustSkills: string[];
  niceSkills: string[];
  shift: string;
  fillBy: string;
  matchFloor: string;
};

export type RecruiterRequirement = RecruiterRequirementForm & {
  id: string;
  filed: string;
  status: "new";
  recruiter: string;
  agency: string;
};

export type RecruiterThreadTag = { kind: "general" } | { kind: "candidate"; name: string; reqId: string };

export type RecruiterThread = {
  id: string;
  subject: string;
  tag: RecruiterThreadTag;
  time: string;
  messages: { from: "Priya Shah" | "YZI Admin"; text: string; time: string }[];
};

type State = { requirements: RecruiterRequirement[]; threads: RecruiterThread[] };

const stamp = () => new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

let state: State = {
  requirements: [],
  threads: [
    {
      id: "RTH-1",
      subject: "Interview slots for the .NET shortlist",
      tag: { kind: "candidate", name: "Ananya Rao", reqId: "REQ-104" },
      time: "09:18",
      messages: [
        { from: "Priya Shah", text: "Can we get two interview slots this week for the .NET profile in workflow?", time: "09:18" },
        { from: "YZI Admin", text: "Checking availability with the candidate. You will hear back today.", time: "09:26" },
      ],
    },
    {
      id: "RTH-2",
      subject: "Pool depth on REQ-201",
      tag: { kind: "general" },
      time: "Yesterday",
      messages: [
        { from: "Priya Shah", text: "REQ-201 looks thin. Should we widen the notice period band?", time: "Yesterday" },
        { from: "YZI Admin", text: "Sourcing is running. First matches land tomorrow.", time: "Yesterday" },
      ],
    },
  ],
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

let reqCounter = 317;
let threadCounter = 2;

export const recruiterStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() {
    return state;
  },
  fileRequirement(form: RecruiterRequirementForm) {
    reqCounter += 1;
    const req: RecruiterRequirement = { ...form, id: `REQ-${reqCounter}`, filed: stamp(), status: "new", recruiter: "Priya Shah", agency: "Eventrics" };
    state = { ...state, requirements: [req, ...state.requirements] };
    emit();
    return req;
  },
  sendToYzi(subject: string, tag: RecruiterThreadTag, body: string) {
    threadCounter += 1;
    const time = stamp();
    const thread: RecruiterThread = { id: `RTH-${threadCounter}`, subject, tag, time, messages: [{ from: "Priya Shah", text: body, time }] };
    state = { ...state, threads: [thread, ...state.threads] };
    emit();
    return thread;
  },
};

export function useRecruiterStore() {
  return useSyncExternalStore(recruiterStore.subscribe, recruiterStore.getSnapshot, recruiterStore.getSnapshot);
}

export function tagLabel(tag: RecruiterThreadTag) {
  return tag.kind === "general" ? "YZI general" : `${tag.name} · ${tag.reqId}`;
}
