import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { candidates, demoStore, useDemoStore } from "@/lib/mock-store";
import { recruiterStore, tagLabel, useRecruiterStore, type RecruiterRequirementForm, type RecruiterThreadTag } from "@/lib/recruiter-store";
import { ArrowLeft, Check, ChevronRight, Plus, Send, X } from "lucide-react";

type Action = (message: string) => void;

const MY_REQS = [
  { id: "REQ-104", role: "Senior .NET Engineer", city: "Bengaluru", filed: "26 Aug 2026", status: "Pool matched" },
  { id: "REQ-201", role: "React Engineer", city: "Pune", filed: "24 Aug 2026", status: "Pool thin" },
];

const roleOf = (reqId: string) => MY_REQS.find((item) => item.id === reqId)?.role ?? "Open role";

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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] tracking-[0.16em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border py-2.5 last:border-0">
      <span className="font-mono text-[10px] tracking-widest text-muted-foreground">{label}</span>
      <span className="text-right text-[13px] font-medium">{value}</span>
    </div>
  );
}

/* ---------------- Candidate pool ---------------- */

export function RecruiterPool({ action }: { action: Action }) {
  const store = useDemoStore();
  const [openId, setOpenId] = useState<string | null>(null);
  const rows = useMemo(() => candidates.filter((item) => item.requirement === "REQ-104" || item.requirement === "REQ-201"), []);
  const open = rows.find((item) => item.id === openId) ?? null;
  const accepted = (id: string) => (id === "CAND-0417" ? store.acceptedRahul : false);

  return (
    <div className="space-y-5">
      <Heading eyebrow="RECRUITER · CANDIDATE POOL" title="Vetted profiles against your REQ-IDs." description="Contact details stay with YZI. You see the spec, the requirement and the city — nothing personal." />
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="grid grid-cols-[1.4fr_0.7fr_1.2fr_0.8fr_0.5fr] gap-3 border-b border-border px-5 py-2.5 font-mono text-[10px] tracking-widest text-muted-foreground">
          <span>CANDIDATE</span><span>REQ</span><span>ROLE</span><span>CITY</span><span />
        </div>
        {rows.map((item) => (
          <button key={item.id} type="button" onClick={() => setOpenId(openId === item.id ? null : item.id)} className={cn("grid w-full grid-cols-[1.4fr_0.7fr_1.2fr_0.8fr_0.5fr] items-center gap-3 border-b border-border px-5 py-3.5 text-left transition-colors last:border-0 hover:bg-muted/60", openId === item.id && "bg-steel-soft/70")}>
            <span className="flex min-w-0 items-center gap-2.5">
              <span className={cn("grid size-9 shrink-0 place-items-center rounded-md font-mono text-[10px]", openId === item.id ? "bg-steel text-primary-foreground" : "bg-muted text-steel")}>{item.initials}</span>
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-medium">{item.name}</span>
                <span className="block font-mono text-[10px] text-muted-foreground">{item.stack} · {item.years}</span>
              </span>
            </span>
            <span className="font-mono text-[11px] font-medium text-steel">{item.requirement}</span>
            <span className="truncate text-xs">{roleOf(item.requirement)}</span>
            <span className="text-xs text-muted-foreground">{item.city}</span>
            <ChevronRight className="ml-auto size-4 text-muted-foreground" />
          </button>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-40 flex justify-end bg-background/60 backdrop-blur-sm" onClick={() => setOpenId(null)}>
          <aside className="sera-rise flex h-full w-full max-w-md flex-col border-l border-border bg-card shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
              <div>
                <div className="text-base font-semibold tracking-tight">{open.name}</div>
                <div className="mt-1 text-xs text-muted-foreground">{roleOf(open.requirement)} · <span className="font-mono text-steel">{open.requirement}</span></div>
              </div>
              <button type="button" aria-label="Close" onClick={() => setOpenId(null)} className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-muted"><X className="size-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="rounded-md bg-muted px-3 py-2 font-mono text-[10px] tracking-widest text-muted-foreground">CONTACT HIDDEN · MEDIATED BY YZI</div>
              <div className="mt-4">
                <Row label="REQUIREMENT" value={`${roleOf(open.requirement)} · ${open.requirement}`} />
                <Row label="STACK" value={open.stack} />
                <Row label="EXPERIENCE" value={open.years} />
                <Row label="CITY" value={open.city} />
                <Row label="WORK MODE" value="Hybrid · 3 days office" />
                <Row label="NOTICE" value="30 days" />
                <Row label="CTC BAND" value="₹18 – ₹28 LPA" />
                <Row label="STATUS" value={accepted(open.id) ? "In your workflow" : open.status === "workflow" ? "In your workflow" : "Matched by Sera"} />
              </div>
              <div className="mt-5">
                <div className="font-mono text-[10px] tracking-widest text-muted-foreground">MUST-HAVE</div>
                <div className="mt-2 flex flex-wrap gap-2">{[open.stack, "Azure", "SQL Server"].map((skill) => <span key={skill} className="rounded-full bg-steel-soft px-2.5 py-1 text-[11px] text-steel">{skill}</span>)}</div>
                <div className="mt-4 font-mono text-[10px] tracking-widest text-muted-foreground">NICE-TO-HAVE</div>
                <div className="mt-2 flex flex-wrap gap-2">{["Kubernetes", "Event-driven design"].map((skill) => <span key={skill} className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">{skill}</span>)}</div>
              </div>
              <div className="mt-5 rounded-md bg-steel-soft p-4">
                <div className="font-mono text-[10px] tracking-widest text-steel">WHY SERA MATCHED</div>
                <p className="mt-2 text-[13px] leading-relaxed">Stack, city and notice period align with {open.requirement}. Verified work history, delivery record in the same domain.</p>
              </div>
            </div>
            <div className="flex gap-2 border-t border-border px-5 py-4">
              <Button
                className="flex-1"
                variant={accepted(open.id) ? "secondary" : "default"}
                onClick={() => {
                  if (open.id === "CAND-0417") demoStore.acceptRahul();
                  action(`${open.name} accepted into workflow · ${open.requirement}`);
                  setOpenId(null);
                }}
              >
                {accepted(open.id) ? <><Check className="size-4" /> Accepted</> : "Accept into workflow"}
              </Button>
              <Button className="flex-1" variant="outline" onClick={() => { action(`${open.name} rejected for ${open.requirement}`); setOpenId(null); }}>Reject</Button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

/* ---------------- Requirements ---------------- */

const emptyForm: RecruiterRequirementForm = {
  role: "", field: "", city: "", mode: "Hybrid", joiningLocation: "", accommodation: "no", exp: "", ctc: "", notice: "", heads: "1", mustSkills: [], niceSkills: [], shift: "", fillBy: "", matchFloor: "80",
};

export function RecruiterRequirements({ action, openForm = false, onFormClosed }: { action: Action; openForm?: boolean; onFormClosed?: () => void }) {
  const [filing, setFiling] = useState(openForm);
  const store = useRecruiterStore();
  const closeForm = () => { setFiling(false); onFormClosed?.(); };

  if (filing) return <RequirementPage onBack={closeForm} action={action} />;

  return (
    <div className="space-y-5">
      <Heading eyebrow="RECRUITER · REQUIREMENTS" title="Every hire starts with a REQ-ID." description="File the brief once. YZI matches the pool and sends specs back with contact protected.">
        <Button onClick={() => setFiling(true)}><Plus className="size-4" /> File requirement</Button>
      </Heading>
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        {[...store.requirements.map((item) => ({ id: item.id, role: item.role, city: item.city, filed: item.filed, status: "New · with YZI" })), ...MY_REQS].map((item) => (
          <div key={item.id} className="flex flex-wrap items-center gap-4 border-b border-border px-5 py-4 last:border-0">
            <span className="font-mono text-xs font-semibold text-steel">{item.id}</span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium">{item.role}</div>
              <div className="mt-1 text-xs text-muted-foreground">{item.city} · filed {item.filed}</div>
            </div>
            <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-medium", item.status === "Pool thin" ? "bg-signal-soft text-signal" : item.status === "Pool matched" ? "bg-ok-soft text-ok" : "bg-steel-soft text-steel")}>{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChipInput({ label, values, onChange }: { label: string; values: string[]; onChange: (next: string[]) => void }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const value = draft.trim();
    if (!value) return;
    onChange([...values, value]);
    setDraft("");
  };
  return (
    <div>
      <span className="mb-1.5 block font-mono text-[10px] tracking-[0.16em] text-muted-foreground">{label}</span>
      <div className="flex gap-2">
        <Input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); add(); } }} placeholder="Type a skill, press Enter" />
        <Button type="button" variant="outline" onClick={add}>Add</Button>
      </div>
      {values.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {values.map((value, index) => (
            <button key={`${value}-${index}`} type="button" onClick={() => onChange(values.filter((_, i) => i !== index))} className="flex items-center gap-1.5 rounded-full bg-steel-soft px-2.5 py-1 text-[11px] text-steel">
              {value} <X className="size-3" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function RequirementPage({ onBack, action }: { onBack: () => void; action: Action }) {
  const [form, setForm] = useState<RecruiterRequirementForm>(emptyForm);
  const set = <K extends keyof RecruiterRequirementForm>(key: K, value: RecruiterRequirementForm[K]) => setForm((prev) => ({ ...prev, [key]: value }));
  const selectClass = "h-9 w-full rounded-md border border-input bg-background px-3 text-sm";

  return (
    <div className="space-y-5">
      <button type="button" onClick={onBack} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="size-3.5" /> All requirements</button>
      <Heading eyebrow="RECRUITER · FILE REQUIREMENT" title="File the full brief." description="This is exactly what the YZI desk will read. Nothing is asked twice." />
      <div className="space-y-5 rounded-lg border border-border bg-card p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="ROLE"><Input value={form.role} onChange={(event) => set("role", event.target.value)} placeholder="Senior .NET Engineer" /></Field>
          <Field label="FIELD"><Input value={form.field} onChange={(event) => set("field", event.target.value)} placeholder="Engineering" /></Field>
          <Field label="CITY"><Input value={form.city} onChange={(event) => set("city", event.target.value)} placeholder="Bengaluru" /></Field>
          <Field label="WORK MODE">
            <select className={selectClass} value={form.mode} onChange={(event) => set("mode", event.target.value as RecruiterRequirementForm["mode"])}>
              <option value="WFO">WFO</option><option value="Hybrid">Hybrid</option><option value="WFH">WFH</option>
            </select>
          </Field>
          <Field label="JOINING LOCATION"><Input value={form.joiningLocation} onChange={(event) => set("joiningLocation", event.target.value)} placeholder="Outer Ring Road" /></Field>
          <Field label="ACCOMMODATION">
            <select className={selectClass} value={form.accommodation} onChange={(event) => set("accommodation", event.target.value as RecruiterRequirementForm["accommodation"])}>
              <option value="no">No</option><option value="yes">Yes</option>
            </select>
          </Field>
          <Field label="EXPERIENCE"><Input value={form.exp} onChange={(event) => set("exp", event.target.value)} placeholder="5 – 8 years" /></Field>
          <Field label="CTC BAND"><Input value={form.ctc} onChange={(event) => set("ctc", event.target.value)} placeholder="₹18 – ₹28 LPA" /></Field>
          <Field label="NOTICE"><Input value={form.notice} onChange={(event) => set("notice", event.target.value)} placeholder="Up to 60 days" /></Field>
          <Field label="HEADCOUNT"><Input type="number" min={1} value={form.heads} onChange={(event) => set("heads", event.target.value)} /></Field>
          <Field label="SHIFT"><Input value={form.shift} onChange={(event) => set("shift", event.target.value)} placeholder="General shift · No bond" /></Field>
          <Field label="FILL BY"><Input type="date" value={form.fillBy} onChange={(event) => set("fillBy", event.target.value)} /></Field>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <ChipInput label="MUST-HAVE SKILLS" values={form.mustSkills} onChange={(next) => set("mustSkills", next)} />
          <ChipInput label="NICE-TO-HAVE SKILLS" values={form.niceSkills} onChange={(next) => set("niceSkills", next)} />
        </div>
        <div className="max-w-sm">
          <span className="mb-1.5 block font-mono text-[10px] tracking-[0.16em] text-muted-foreground">MATCH FLOOR · {form.matchFloor}%</span>
          <input type="range" min={50} max={100} step={5} value={form.matchFloor} onChange={(event) => set("matchFloor", event.target.value)} className="w-full accent-[var(--steel)]" />
        </div>
        <div className="flex justify-end gap-2 border-t border-border pt-5">
          <Button variant="outline" onClick={onBack}>Cancel</Button>
          <Button
            onClick={() => {
              const req = recruiterStore.fileRequirement({ ...form, role: form.role || "Untitled role", city: form.city || "—" });
              action(`${req.id} filed with YZI · status new`);
              onBack();
            }}
          >
            Submit to YZI
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Messages ---------------- */

const deskCandidates = candidates.filter((item) => item.requirement === "REQ-104" || item.requirement === "REQ-201");

export function RecruiterMessages({ action }: { action: Action }) {
  const store = useRecruiterStore();
  const [subject, setSubject] = useState("");
  const [tagValue, setTagValue] = useState("general");
  const [body, setBody] = useState("");
  const [activeId, setActiveId] = useState(store.threads[0]?.id ?? "");
  const active = store.threads.find((thread) => thread.id === activeId) ?? store.threads[0];

  const send = () => {
    if (!subject.trim() || !body.trim()) return;
    const picked = deskCandidates.find((item) => item.id === tagValue);
    const tag: RecruiterThreadTag = picked ? { kind: "candidate", name: picked.name, reqId: picked.requirement } : { kind: "general" };
    const thread = recruiterStore.sendToYzi(subject.trim(), tag, body.trim());
    setActiveId(thread.id);
    setSubject("");
    setBody("");
    setTagValue("general");
    action(`Sent to YZI · ${thread.subject}`);
  };

  return (
    <div className="space-y-5">
      <Heading eyebrow="RECRUITER · YZI ONLY" title="Write to YZI." description="One desk, one mediator. Candidates are never in this inbox." />
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.3fr]">
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          {store.threads.map((thread) => (
            <button key={thread.id} type="button" onClick={() => setActiveId(thread.id)} className={cn("w-full border-b border-border px-4 py-3 text-left transition-colors last:border-0 hover:bg-muted/60", active?.id === thread.id && "bg-steel-soft/60")}>
              <div className="truncate text-[13px] font-medium">{thread.subject}</div>
              <div className="mt-1 flex items-center justify-between gap-2 font-mono text-[10px] text-muted-foreground">
                <span className="truncate">{tagLabel(thread.tag)}</span>
                <span>{thread.time}</span>
              </div>
            </button>
          ))}
        </div>
        <div className="flex min-h-[380px] flex-col overflow-hidden rounded-lg border border-border bg-card">
          {active && (
            <>
              <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
                <div className="text-sm font-semibold">{active.subject}</div>
                <span className="font-mono text-[10px] tracking-wider text-muted-foreground">{tagLabel(active.tag)}</span>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
                {active.messages.map((message, index) => {
                  const mine = message.from === "Priya Shah";
                  return (
                    <div key={index} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                      <div className={cn("max-w-[80%] rounded-lg px-3.5 py-2.5", mine ? "bg-primary text-primary-foreground" : "bg-muted")}>
                        <div className="text-[13px] leading-relaxed">{message.text}</div>
                        <div className="mt-1 font-mono text-[9px] opacity-70">{message.time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          <div className="space-y-3 border-t border-border p-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <Input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Subject" />
              <select value={tagValue} onChange={(event) => setTagValue(event.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option value="general">YZI general</option>
                {deskCandidates.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.requirement}</option>)}
              </select>
            </div>
            <Textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="Write to YZI Admin…" className="min-h-[90px]" />
            <div className="flex justify-end">
              <Button onClick={send} disabled={!subject.trim() || !body.trim()}><Send className="size-4" /> Send to YZI</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
