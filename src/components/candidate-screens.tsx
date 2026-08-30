import { useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  candidateStages,
  candidateStore,
  docKindLabel,
  useCandidateStore,
  type CandidateStage,
  type DocKind,
  type JobInvite,
} from "@/lib/candidate-store";
import { Check, ChevronRight, Clock, FileText, LockKeyhole, MessageSquareWarning, Plus, Sparkles, Upload, X } from "lucide-react";

type Action = (message: string) => void;

function Heading({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <div className="mb-2 font-mono text-[10px] tracking-[0.2em] text-muted-foreground">{eyebrow}</div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-[28px]">{title}</h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-steel-soft px-2.5 py-1 text-[11px] font-medium text-steel">{children}</span>;
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-lg border border-border bg-card p-5", className)}>{children}</div>;
}

function Modal({ title, subtitle, onClose, children }: { title: string; subtitle: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/25 p-4 backdrop-blur-[2px]" onClick={onClose}>
      <div className="sera-rise w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold tracking-tight">{title}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <button type="button" aria-label="Close" onClick={onClose} className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-muted"><X className="size-4" /></button>
        </div>
        <div className="mt-5 space-y-4">{children}</div>
      </div>
    </div>
  );
}

/* ---------------------------------- HOME --------------------------------- */

export function CandidateHome({ action, onSection }: { action: Action; onSection: (section: string) => void }) {
  const store = useCandidateStore();
  const [openId, setOpenId] = useState<string | null>(null);
  const open = store.invites.find((invite) => invite.id === openId);
  const matches = store.invites.filter((invite) => invite.status !== "rejected").slice(0, 3);

  return (
    <div className="space-y-5">
      <Heading eyebrow="CANDIDATE · ARJUN KAPOOR" title="Good evening, Arjun." description="Roles Sera matched to you. YZI stays between you and every hiring desk.">
        <span className="flex items-center gap-2 rounded-md bg-ok-soft px-3 py-2 text-xs font-medium text-ok"><span className="size-1.5 rounded-full bg-ok" />Profile active</span>
      </Heading>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold">Matching roles for you</div>
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground">{matches.length} MATCHES</span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {matches.map((invite) => (
            <button key={invite.id} type="button" onClick={() => setOpenId(invite.id)} className="rounded-lg border border-border bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:border-steel hover:shadow-md">
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-[10px] tracking-widest text-steel">{invite.reqId}</span>
                {invite.status === "applied" && <span className="rounded-full bg-ok-soft px-2 py-0.5 text-[10px] font-medium text-ok">Applied</span>}
              </div>
              <div className="mt-4 text-base font-semibold leading-snug">{invite.role}</div>
              <div className="mt-1 text-xs text-muted-foreground">{invite.city}</div>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{invite.why}</p>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-3 text-[11px] text-muted-foreground">Open full JD <ChevronRight className="size-4" /></div>
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-3">
        <MiniCard title="My progress" value={candidateStages[store.stepIndex] ?? "Profile"} note="Current milestone" onClick={() => onSection("workflow")} />
        <MiniCard title="Documents" value={`${store.docs.length} uploaded`} note="Typed and stacked" onClick={() => onSection("documents")} />
        <MiniCard title="Feedback" value={store.feedback.length ? (store.feedback[0]?.status === "accepted" ? "Received and reviewed" : "Under review") : "Share yours"} note="About YZI or an employer" onClick={() => onSection("feedback")} />
      </div>

      {open && <JobPanel invite={open} onClose={() => setOpenId(null)} action={action} />}
    </div>
  );
}

function MiniCard({ title, value, note, onClick }: { title: string; value: string; note: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-steel hover:bg-steel-soft/30">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-2 text-lg font-semibold tracking-tight">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{note}</div>
    </button>
  );
}

function SpecField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-mono text-[10px] tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium">{children}</div>
    </div>
  );
}

function JobPanel({ invite, onClose, action }: { invite: JobInvite; onClose: () => void; action: Action }) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-foreground/25 backdrop-blur-[2px]" onClick={onClose}>
      <aside className="sera-rise flex h-full w-full max-w-[480px] flex-col border-l border-border bg-card" onClick={(event) => event.stopPropagation()}>
        <header className="flex items-start justify-between gap-3 border-b border-border px-6 py-5">
          <div>
            <div className="font-mono text-[10px] tracking-widest text-steel">{invite.reqId}</div>
            <div className="mt-1.5 text-lg font-semibold tracking-tight">{invite.role}</div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="size-3" /> Apply by {invite.deadline}
            </div>
          </div>
          <button type="button" aria-label="Close" onClick={onClose} className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-muted"><X className="size-4" /></button>
        </header>
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-2 gap-5">
            <SpecField label="CTC BAND">{invite.ctc}</SpecField>
            <SpecField label="EXPERIENCE REQUIRED">{invite.experience}</SpecField>
            <SpecField label="CITY">{invite.city}</SpecField>
            <SpecField label="JOINING LOCATION">{invite.joiningLocation}</SpecField>
            <SpecField label="WORK NATURE">{invite.mode}</SpecField>
            <SpecField label="NOTICE EXPECTED">{invite.notice}</SpecField>
            <SpecField label="ACCOMMODATION">
              {invite.accommodation.provided ? `Yes · ${invite.accommodation.city}` : "Not provided"}
            </SpecField>
            <SpecField label="SHIFT / BOND">{invite.shiftBond}</SpecField>
          </div>
          <div>
            <div className="font-mono text-[10px] tracking-widest text-muted-foreground">MUST-HAVE SKILLS</div>
            <div className="mt-2 flex flex-wrap gap-2">{invite.mustSkills.map((skill) => <Tag key={skill}>{skill}</Tag>)}</div>
          </div>
          <div>
            <div className="font-mono text-[10px] tracking-widest text-muted-foreground">NICE-TO-HAVE</div>
            <div className="mt-2 flex flex-wrap gap-2">{invite.niceSkills.map((skill) => <Tag key={skill}>{skill}</Tag>)}</div>
          </div>
          <SpecField label="DOMAIN">{invite.domain}</SpecField>
          <div>
            <div className="font-mono text-[10px] tracking-widest text-muted-foreground">WHY SERA MATCHED YOU</div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{invite.why}</p>
          </div>
          <div className="rounded-md border border-border bg-muted/40 p-4">
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-steel"><Sparkles className="size-3" /> SERA NOTE</div>
            <p className="mt-2 text-sm leading-relaxed">{invite.seraNote}</p>
          </div>
        </div>
        <footer className="space-y-2 border-t border-border px-6 py-5">
          {invite.status === "applied" ? (
            <div className="rounded-md bg-ok-soft px-3 py-2 text-[12px] text-ok">Applied. YZI will send your spec to the hiring desk.</div>
          ) : (
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => { candidateStore.applyInvite(invite.id); action(`Applied · ${invite.role} · ${invite.reqId} · YZI notified`); onClose(); }}>Apply</Button>
              <Button variant="outline" className="flex-1" onClick={() => { candidateStore.rejectInvite(invite.id); action("Marked not for me"); onClose(); }}>Not for me</Button>
            </div>
          )}
          <p className="text-[11px] text-muted-foreground">You never see the hiring company name or contact. YZI handles the desk.</p>
        </footer>
      </aside>
    </div>
  );
}

/* -------------------------------- PROGRESS -------------------------------- */

export function CandidateProgress({ action }: { action: Action }) {
  const store = useCandidateStore();
  const [ask, setAsk] = useState(false);
  const [milestone, setMilestone] = useState<CandidateStage>(candidateStages[store.stepIndex] ?? "Profile");
  const [body, setBody] = useState("");
  const current = store.stepIndex;
  const currentStage = candidateStages[current] ?? "Profile";
  const reqId = store.invites.find((invite) => invite.status === "applied")?.reqId ?? "REQ-104";
  const stale = (store.stepAgeDays[currentStage] ?? 0) >= 20;

  return (
    <div className="space-y-5">
      <Heading eyebrow="CANDIDATE · MY PROGRESS" title="My progress." description="Eight milestones. YZI unlocks each one and stamps the date.">
        <Button variant="quiet" onClick={() => setAsk(true)}><MessageSquareWarning className="size-4" /> Ask Sera</Button>
      </Heading>

      <Card>
        <div className="flex flex-col justify-between gap-3 border-b border-border pb-4 sm:flex-row sm:items-center">
          <div>
            <div className="text-sm font-semibold">Arjun Kapoor</div>
            <div className="mt-1 font-mono text-[10px] text-muted-foreground">CAND-0417 · {reqId}</div>
          </div>
          <span className="w-fit rounded-full bg-signal-soft px-2.5 py-1 text-[10px] font-medium text-signal">Milestone {current + 1} / 8</span>
        </div>

        <div className="mt-6 overflow-x-auto pb-2">
          <div className="flex min-w-[680px] items-start">
            {candidateStages.map((stage, index) => (
              <div key={stage} className="relative flex flex-1 flex-col items-center px-1 text-center">
                <div className={cn("z-10 grid size-8 place-items-center rounded-full border text-xs font-semibold", index < current ? "border-ok bg-ok text-primary-foreground" : index === current ? "border-signal bg-signal text-primary-foreground" : "border-border bg-background text-muted-foreground")}>{index < current ? <Check className="size-4" /> : index + 1}</div>
                <div className={cn("mt-2 text-[11px]", index <= current ? "font-medium text-foreground" : "text-muted-foreground")}>{stage}</div>
                {store.stepDates[stage] && <div className="mt-1 font-mono text-[9px] leading-tight text-muted-foreground">{store.stepDates[stage]}</div>}
                {index < candidateStages.length - 1 && <div className={cn("absolute left-1/2 top-4 h-px w-full", index < current ? "bg-ok" : "bg-border")} />}
              </div>
            ))}
          </div>
        </div>

        {stale && (
          <div className="mt-5 flex items-center gap-2 rounded-md bg-signal-soft px-3 py-2 text-[12px] text-signal">
            <Clock className="size-3.5" /> This step is 20+ days. Ask Sera if you need a nudge.
          </div>
        )}

        <div className="mt-5 grid gap-4 border-t border-border pt-5 md:grid-cols-3">
          <div><div className="font-mono text-[10px] tracking-widest text-muted-foreground">CURRENT</div><div className="mt-1 text-sm font-medium">{currentStage}</div></div>
          <div><div className="font-mono text-[10px] tracking-widest text-muted-foreground">UPDATED</div><div className="mt-1 text-sm font-medium">{store.stepDates[currentStage] ?? "Awaiting YZI"}</div></div>
          <div><div className="font-mono text-[10px] tracking-widest text-muted-foreground">REQUIREMENT</div><div className="mt-1 font-mono text-sm font-medium text-steel">{reqId}</div></div>
        </div>
      </Card>

      {store.grievances.length > 0 && (
        <Card>
          <div className="text-sm font-semibold">Your Ask Sera notes</div>
          <div className="mt-4 space-y-3">
            {store.grievances.map((item) => (
              <div key={item.id} className="rounded-md border border-border p-3">
                <div className="font-mono text-[10px] tracking-widest text-steel">PROBLEM AT {item.milestone.toUpperCase()} · {item.reqId}</div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.body}</p>
                <div className="mt-2 font-mono text-[10px] text-muted-foreground">{item.createdAt}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {ask && (
        <Modal title="Ask Sera" subtitle="Pick the milestone and tell us what is stuck. It reaches YZI Admin." onClose={() => setAsk(false)}>
          <label className="block text-xs font-medium">Milestone
            <select value={milestone} onChange={(event) => setMilestone(event.target.value as CandidateStage)} className="mt-2 h-9 w-full rounded-md border border-border bg-background px-3 text-sm">
              {candidateStages.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
            </select>
          </label>
          <label className="block text-xs font-medium">What is the problem?
            <Textarea value={body} onChange={(event) => setBody(event.target.value)} rows={4} className="mt-2" placeholder="Describe the delay or issue…" />
          </label>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={() => setAsk(false)}>Cancel</Button>
            <Button disabled={!body.trim()} onClick={() => { candidateStore.addGrievance(milestone, body.trim(), reqId); setBody(""); setAsk(false); action(`Sent to YZI Admin · problem at ${milestone} · ${reqId}`); }}>Send to Sera</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ------------------------------- DOCUMENTS -------------------------------- */

const docKinds: DocKind[] = ["pan", "aadhaar", "voter_id", "company_id", "payslip", "cv", "resume", "other"];

export function CandidateDocuments({ action }: { action: Action }) {
  const store = useCandidateStore();
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<DocKind>("pan");
  const [fileName, setFileName] = useState("");

  const onFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);
    if (file) setFileName(file.name);
  };

  const grouped = docKinds.map((item) => ({ kind: item, docs: store.docs.filter((doc) => doc.kind === item) })).filter((group) => group.docs.length);

  return (
    <div className="space-y-5">
      <Heading eyebrow="CANDIDATE · DOCUMENTS" title="Your document drawer." description="Every file carries a type. YZI shares only what the next milestone needs.">
        <Button variant="quiet" onClick={() => setOpen(true)}><Upload className="size-4" /> Upload document</Button>
      </Heading>

      <div className="grid gap-4 md:grid-cols-2">
        {grouped.map((group) => (
          <Card key={group.kind}>
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">{docKindLabel[group.kind]}</div>
              <span className="font-mono text-[10px] tracking-widest text-muted-foreground">{group.docs.length} FILE{group.docs.length > 1 ? "S" : ""}</span>
            </div>
            <div className="mt-4 space-y-2">
              {group.docs.map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 rounded-md border border-border p-3">
                  <div className="grid size-9 place-items-center rounded-md bg-steel-soft text-steel"><FileText className="size-4" /></div>
                  <div className="min-w-0">
                    <div className="truncate text-[13px] font-medium">{doc.name}</div>
                    <div className="mt-0.5 font-mono text-[10px] text-muted-foreground">{doc.uploadedAt}</div>
                  </div>
                  <Check className="ml-auto size-4 text-ok" />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {open && (
        <Modal title="Upload document" subtitle="Choose the type first. Untyped files are not accepted." onClose={() => setOpen(false)}>
          <label className="block text-xs font-medium">Document type
            <select value={kind} onChange={(event) => setKind(event.target.value as DocKind)} className="mt-2 h-9 w-full rounded-md border border-border bg-background px-3 text-sm">
              {docKinds.map((item) => <option key={item} value={item}>{docKindLabel[item]}</option>)}
            </select>
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-border p-4 text-xs text-muted-foreground hover:border-steel">
            <Plus className="size-4" />
            {fileName || "Choose a file (PDF, JPG, PNG)"}
            <input type="file" className="hidden" accept=".pdf,.doc,.docx,.png,.jpg" onChange={onFile} />
          </label>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button disabled={!fileName} onClick={() => { candidateStore.addDoc(kind, fileName); setFileName(""); setOpen(false); action(`${docKindLabel[kind]} uploaded · awaiting YZI review`); }}>Upload</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* -------------------------------- PROFILE --------------------------------- */

export function CandidateProfileScreen({ action }: { action: Action }) {
  const store = useCandidateStore();
  const [work, setWork] = useState(store.profile.work);
  const [expertise, setExpertise] = useState(store.profile.expertise);
  const [about, setAbout] = useState(store.profile.about);
  const [chip, setChip] = useState("");
  const [request, setRequest] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const identity = store.profile.identity;
  const status = store.profile.accountStatus;

  const updateWork = (index: number, key: keyof (typeof work)[number], value: string) => {
    setWork((current) => current.map((entry, position) => (position === index ? { ...entry, [key]: value } : entry)));
  };

  return (
    <div className="space-y-5">
      <Heading eyebrow="CANDIDATE · PROFILE" title="Your profile, in your control." description="Identity is locked by YZI. Work, expertise and about stay yours to edit.">
        <span className={cn("flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium", status === "active" ? "bg-ok-soft text-ok" : status === "inactive" ? "bg-muted text-muted-foreground" : "bg-signal-soft text-signal")}>
          <span className={cn("size-1.5 rounded-full", status === "active" ? "bg-ok" : status === "inactive" ? "bg-muted-foreground" : "bg-signal")} />
          {status === "active" ? "Active" : status === "inactive" ? "Inactive" : "Blocked"}
        </span>
      </Heading>

      <Card className="bg-muted/40">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold"><LockKeyhole className="size-4 text-muted-foreground" /> Identity · locked</div>
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground">YZI VERIFIED</span>
        </div>
        <div className="mt-5 flex flex-col gap-5 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="grid size-16 place-items-center rounded-full bg-steel-soft text-lg font-semibold text-steel">AK</div>
            <div>
              <div className="text-base font-semibold">{identity.name}</div>
              <div className="mt-1 font-mono text-[10px] text-muted-foreground">CAND-0417</div>
            </div>
          </div>
          <div className="grid flex-1 gap-4 sm:grid-cols-2">
            {([["Phone", identity.phone], ["Email", identity.email], ["City", identity.city], ["Address", identity.address]] as const).map(([label, value]) => (
              <div key={label} className="rounded-md border border-border bg-background/60 px-3 py-2">
                <div className="font-mono text-[10px] tracking-widest text-muted-foreground">{label.toUpperCase()}</div>
                <div className="mt-1 text-sm text-muted-foreground">{value}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
          {["Name", "Phone", "Email", "City", "Address"].map((field) => (
            <Button key={field} size="sm" variant="outline" onClick={() => setRequest(field)}>Request change · {field}</Button>
          ))}
        </div>
        {store.identityRequests.length > 0 && (
          <div className="mt-4 space-y-2">
            {store.identityRequests.map((item, index) => (
              <div key={`${item.field}-${index}`} className="rounded-md bg-signal-soft px-3 py-2 text-[12px] text-signal">{item.field} change requested · pending YZI review</div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Work</div>
          <Button size="sm" variant="outline" onClick={() => setWork((current) => [...current, { company: "", title: "", field: "", years: "", notice: "", currentCtc: "", expectedCtc: "" }])}><Plus className="size-3.5" /> Add another company</Button>
        </div>
        <div className="mt-5 space-y-6">
          {work.map((entry, index) => (
            <div key={index} className="grid gap-4 border-t border-border pt-5 first:border-0 first:pt-0 sm:grid-cols-2 lg:grid-cols-3">
              <label className="text-xs font-medium">Current company<Input value={entry.company} onChange={(event) => updateWork(index, "company", event.target.value)} className="mt-2" /></label>
              <label className="text-xs font-medium">Title<Input value={entry.title} onChange={(event) => updateWork(index, "title", event.target.value)} className="mt-2" /></label>
              <label className="text-xs font-medium">Field<Input value={entry.field} onChange={(event) => updateWork(index, "field", event.target.value)} className="mt-2" /></label>
              <label className="text-xs font-medium">Years<Input value={entry.years} onChange={(event) => updateWork(index, "years", event.target.value)} className="mt-2" /></label>
              <label className="text-xs font-medium">Notice<Input value={entry.notice} onChange={(event) => updateWork(index, "notice", event.target.value)} className="mt-2" /></label>
              <label className="text-xs font-medium">Current CTC<Input value={entry.currentCtc} onChange={(event) => updateWork(index, "currentCtc", event.target.value)} className="mt-2" /></label>
              <label className="text-xs font-medium">Expected CTC<Input value={entry.expectedCtc} onChange={(event) => updateWork(index, "expectedCtc", event.target.value)} className="mt-2" /></label>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="text-sm font-semibold">Expertise</div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {expertise.map((skill) => (
            <span key={skill} className="flex items-center gap-1.5 rounded-full bg-steel-soft px-2.5 py-1 text-[11px] font-medium text-steel">
              {skill}
              <button type="button" aria-label={`Remove ${skill}`} onClick={() => setExpertise((current) => current.filter((item) => item !== skill))}><X className="size-3" /></button>
            </span>
          ))}
          <Input value={chip} onChange={(event) => setChip(event.target.value)} placeholder="Add skill" className="h-8 w-36" onKeyDown={(event) => { if (event.key === "Enter" && chip.trim()) { setExpertise((current) => [...current, chip.trim()]); setChip(""); } }} />
        </div>
      </Card>

      <Card>
        <div className="text-sm font-semibold">About</div>
        <Textarea value={about} onChange={(event) => setAbout(event.target.value)} rows={4} className="mt-4" />
      </Card>

      <div className="flex items-center gap-3">
        <Button onClick={() => { candidateStore.saveWork(work, expertise, about); action("Work and expertise saved · identity untouched"); }}>Save work & expertise</Button>
        <span className="text-[11px] text-muted-foreground">Identity fields never save here. They go through a YZI request.</span>
      </div>

      {request && (
        <Modal title={`Request change · ${request}`} subtitle="YZI Admin reviews every identity change with your reason." onClose={() => setRequest(null)}>
          <label className="block text-xs font-medium">Reason
            <Textarea value={reason} onChange={(event) => setReason(event.target.value)} rows={4} className="mt-2" placeholder="Why does this need to change?" />
          </label>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={() => setRequest(null)}>Cancel</Button>
            <Button disabled={!reason.trim()} onClick={() => { candidateStore.requestIdentityChange(request, reason.trim()); setReason(""); setRequest(null); action(`Identity change request sent · ${request}`); }}>Send request</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* -------------------------------- FEEDBACK -------------------------------- */

export function CandidateFeedback({ action }: { action: Action }) {
  const store = useCandidateStore();
  const [about, setAbout] = useState<"yzi" | "employer">("yzi");
  const [employer, setEmployer] = useState("");
  const [body, setBody] = useState("");

  return (
    <div className="space-y-5">
      <Heading eyebrow="CANDIDATE · FEEDBACK" title="Tell us how it went." description="Feedback about YZI or an employer you met. YZI reviews every note." />

      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Card>
          <div className="text-sm font-semibold">New feedback</div>
          <div className="mt-4 space-y-4">
            <div>
              <div className="text-xs font-medium">This is about</div>
              <div className="mt-2 flex gap-2">
                <Button size="sm" variant={about === "yzi" ? "quiet" : "outline"} onClick={() => setAbout("yzi")}>YZI</Button>
                <Button size="sm" variant={about === "employer" ? "quiet" : "outline"} onClick={() => setAbout("employer")}>An employer</Button>
              </div>
            </div>
            {about === "employer" && (
              <label className="block text-xs font-medium">Employer name<Input value={employer} onChange={(event) => setEmployer(event.target.value)} className="mt-2" placeholder="Company you met" /></label>
            )}
            <label className="block text-xs font-medium">Your experience<Textarea value={body} onChange={(event) => setBody(event.target.value)} rows={5} className="mt-2" placeholder="What worked, what did not…" /></label>
            <Button disabled={!body.trim() || (about === "employer" && !employer.trim())} onClick={() => { candidateStore.addFeedback(about, about === "employer" ? employer.trim() : null, body.trim()); setBody(""); setEmployer(""); action("Feedback sent · under review by YZI"); }}>Send feedback</Button>
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Your feedback</div>
          {store.feedback.length === 0 ? (
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Nothing sent yet. Your notes and their review status will appear here.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {store.feedback.map((item) => (
                <div key={item.id} className="rounded-md border border-border p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-mono text-[10px] tracking-widest text-steel">{item.about === "yzi" ? "ABOUT YZI" : `EMPLOYER · ${item.employerName}`}</div>
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", item.status === "accepted" ? "bg-ok-soft text-ok" : "bg-signal-soft text-signal")}>{item.status === "accepted" ? "Received and reviewed" : "Under review"}</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.body}</p>
                  {item.adminNote && <p className="mt-2 rounded-md bg-ok-soft px-3 py-2 text-[11px] text-ok">YZI: {item.adminNote}</p>}
                  <div className="mt-2 font-mono text-[10px] text-muted-foreground">{item.createdAt}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
