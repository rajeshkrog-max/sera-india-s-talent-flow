import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import rahulPortrait from "@/assets/rahul-mehta.jpg";
import {
  adminApprovals,
  adminCampaigns,
  adminPool,
  adminRequirements,
  adminThreads,
  findPerson,
  findRequirement,
  lockChip,
  originLine,
  poolColumns,
  reqStatusLabel,
  type AdminApproval,
  type AdminPerson,
} from "@/lib/admin-data";
import { ArrowLeft, ArrowRight, Check, ChevronRight, LockKeyhole, Plus, Send, Share2, X } from "lucide-react";


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

function Chip({ children, tone = "steel" }: { children: React.ReactNode; tone?: "steel" | "ok" | "signal" }) {
  return <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-medium", tone === "ok" ? "bg-ok-soft text-ok" : tone === "signal" ? "bg-signal-soft text-signal" : "bg-steel-soft text-steel")}>{children}</span>;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}

export function IdentityDrawer({
  person,
  onClose,
  action,
  footer,
  mailed,
}: {
  person: AdminPerson;
  onClose: () => void;
  action: Action;
  footer?: "spec" | "confirm";
  mailed?: boolean;
}) {
  const canShareDocs = person.step === "Docs";
  const req = findRequirement(person.requirement);
  const [showPlacement, setShowPlacement] = useState(false);
  const [sent, setSent] = useState(false);
  const chip = lockChip(person);
  const locked = person.lock === "locked";
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-foreground/25 backdrop-blur-[2px]" onClick={onClose}>
      <aside className="sera-rise flex h-full w-full max-w-[460px] flex-col border-l border-border bg-card" onClick={(event) => event.stopPropagation()}>
        <header className="flex items-start justify-between gap-3 border-b border-border px-6 py-5">
          <div className="flex items-center gap-3">
            {person.id === "CAND-0417" ? (
              <img src={rahulPortrait} alt={person.name} width={52} height={52} loading="lazy" className="size-[52px] rounded-md object-cover" />
            ) : (
              <div className="grid size-[52px] place-items-center rounded-md bg-steel-soft text-sm font-semibold text-steel">{person.initials}</div>
            )}
            <div>
              <div className="text-base font-semibold tracking-tight">{person.name}</div>
              {locked || person.lock === "placed" ? (
                <div className="mt-1 text-xs text-muted-foreground">{person.lockedRecruiter} · {person.lockedAgency}</div>
              ) : (
                <div className="mt-1 text-xs text-muted-foreground">Not with a recruiter yet</div>
              )}
              <div className="mt-0.5 text-xs font-medium">{req?.role ?? "Unassigned role"} · <span className="font-mono text-[11px] text-steel">{person.requirement}</span></div>
              <div className="mt-2 flex flex-wrap gap-2">
                <Chip tone={person.lock === "vacant" ? "ok" : person.lock === "no_match" ? "signal" : "steel"}>{chip}</Chip>
              </div>
            </div>
          </div>
          <button type="button" aria-label="Close" onClick={onClose} className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-muted"><X className="size-4" /></button>
        </header>


        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          <div className="rounded-md bg-signal-soft p-4">
            <div className="font-mono text-[10px] tracking-widest text-signal">YZI ONLY · CONTACT</div>
            <div className="mt-2 text-sm text-signal">{person.email}</div>
            <div className="text-sm text-signal">{person.phone}</div>
          </div>

          <div className="rounded-md border border-dashed border-border px-4 py-3">
            <div className="font-mono text-[10px] tracking-widest text-muted-foreground">ORIGIN · ADMIN ONLY</div>
            <div className="mt-1.5 text-sm">{originLine(person)}</div>
            <p className="mt-1 text-[11px] text-muted-foreground">Origin never changes. Only the lock moves.</p>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <Field label="CITY" value={person.city} />
            <Field label="EXPERIENCE" value={person.experience} />
            <Field label="CTC" value={person.ctc} />
            <Field label="NOTICE" value={person.notice} />
            <Field label="CURRENT STEP" value={person.step} />
            <Field label="LOCK" value={chip} />
          </div>

          <div>
            <div className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground">SKILLS</div>
            <div className="mt-2 flex flex-wrap gap-2">{person.skills.map((skill) => <Chip key={skill}>{skill}</Chip>)}</div>
          </div>

          <div>
            <div className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground">WHY SERA MATCHED</div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{person.matchReason}</p>
          </div>

          <div className="rounded-md border border-border bg-muted/40 p-4">
            <div className="font-mono text-[10px] tracking-widest text-steel">SERA NOTE</div>
            <p className="mt-2 text-sm leading-relaxed">{person.seraNote}</p>
          </div>
        </div>

        <footer className="space-y-2 border-t border-border px-6 py-5">
          {person.lock === "placed" ? (
            <>
              {showPlacement && person.placement && (
                <div className="mb-3 space-y-2 rounded-md border border-border bg-muted/40 p-4">
                  <div className="font-mono text-[10px] tracking-widest text-steel">PLACEMENT FILE · {person.requirement}</div>
                  <Field label="PACKAGE" value={person.placement.package} />
                  <Field label="TERMS" value={person.placement.terms} />
                  <Field label="PLACED DATE" value={person.placement.placedDate} />
                  <button type="button" onClick={() => action(`Audit row ${person.placement?.auditRef} opened · ${person.name}`)} className="font-mono text-[11px] text-signal underline underline-offset-4">Open audit row {person.placement.auditRef}</button>
                </div>
              )}
              <Button className="w-full" onClick={() => { setShowPlacement((value) => !value); action(`Placement file opened · ${person.name}`); }}>{showPlacement ? "Hide placement file" : "Open placement file"}</Button>
            </>
          ) : person.column === "Offer" ? (
            <>
              <div className="mb-1 rounded-md bg-steel-soft/60 px-3 py-2 text-[12px] text-steel">{person.offerStatus ?? "Offer in progress."}</div>
              <Button className="w-full" onClick={() => action(`Offer file opened · ${person.name} · ${person.requirement}`)}>Open offer file</Button>
            </>
          ) : footer === "confirm" ? (
            mailed ? (
              <div className="rounded-md bg-ok-soft px-3 py-2 text-[12px] text-ok">Email already confirmed for this hit.</div>
            ) : (
              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => { action(`Email confirmed · ${person.name}`); onClose(); }}><Check className="size-4" /> Confirm email</Button>
                <Button variant="outline" className="flex-1" onClick={() => { action(`${person.name} rejected from campaign`); onClose(); }}>Reject</Button>
              </div>
            )
          ) : locked ? (
            <Button className="w-full" disabled><LockKeyhole className="size-4" /> Locked · {person.lockedAgency}</Button>
          ) : person.lock === "no_match" ? (
            <div className="rounded-md bg-muted px-3 py-2 text-[12px] text-muted-foreground">No match on this requirement. Parked for future briefs.</div>
          ) : (
            <>
              <Button className="w-full" disabled={sent} onClick={() => { setSent(true); action(`send_spec · ${person.name} → ${req?.recruiter ?? "recruiter"} · ${req?.agency ?? "agency"} · ${person.requirement} (audit written)`); }}>
                <Send className="size-4" /> {sent ? `Sent · locked to ${req?.agency}` : `Send spec to ${req?.recruiter ?? "recruiter"} · ${req?.agency ?? "agency"} (${person.requirement})`}
              </Button>
              {canShareDocs && (
                <Button variant="outline" className="w-full" onClick={() => action(`Documents shared with recruiter · ${person.name}`)}><Share2 className="size-4" /> Share documents with recruiter</Button>
              )}
              <p className="text-[11px] text-muted-foreground">Contact stays with YZI. Audit meta carries recruiter name, agency and REQ code.</p>
            </>
          )}
        </footer>

      </aside>
    </div>
  );
}


function PersonCard({ person, onClick }: { person: AdminPerson; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="w-full rounded-md border border-border bg-card p-3 text-left transition-colors hover:border-steel hover:bg-steel-soft/30">
      <div className="flex items-center gap-2.5">
        <div className="grid size-8 shrink-0 place-items-center rounded-md bg-muted font-mono text-[10px] text-steel">{person.initials}</div>
        <div className="min-w-0">
          <div className="truncate text-[13px] font-medium">{person.name}</div>
          <div className="font-mono text-[10px] text-muted-foreground">{person.requirement} · {person.stack}</div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
        <span className="truncate">{person.city} · {person.experience}</span>
        <ChevronRight className="size-3.5 shrink-0" />
      </div>
      <div className="mt-2 truncate text-[10px] font-medium text-steel">{lockChip(person)}</div>

    </button>
  );
}

export function AdminPoolBoard({ action, reqFilter }: { action: Action; reqFilter?: string }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = openId ? findPerson(openId) : undefined;
  const req = reqFilter ? findRequirement(reqFilter) : undefined;
  const people = reqFilter ? adminPool.filter((person) => person.requirement === reqFilter) : adminPool;
  return (
    <div className="space-y-5">
      <Heading
        eyebrow={req ? `MATCHES · ${req.id} · ${req.recruiter} · ${req.agency}` : "YZI ADMIN · CANDIDATE POOL"}
        title={req ? `${req.role}, ${req.city}.` : "Candidate pool."}
        description="Registered people only. Every person sits in exactly one column, and full identity opens on the right — recruiters never see it."
      >
        <div className="rounded-md bg-steel-soft px-3 py-2 font-mono text-[10px] tracking-wide text-steel">POOL FIRST · CAMPAIGN IF THIN</div>
      </Heading>
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {poolColumns.map((column) => {
          const columnPeople = people.filter((person) => person.column === column);

          return (
            <section key={column} className="rounded-lg border border-border bg-muted/25 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider">{column}</span>
                <span className="font-mono text-[10px] text-muted-foreground">{people.length}</span>
              </div>
              <div className="mt-3 space-y-2">
                {people.length === 0 ? (
                  <p className="rounded-md border border-dashed border-border px-3 py-4 text-[11px] leading-relaxed text-muted-foreground">Nobody at this stage right now.</p>
                ) : (
                  people.map((person) => <PersonCard key={person.id} person={person} onClick={() => setOpenId(person.id)} />)
                )}
              </div>
            </section>
          );
        })}
      </div>
      {open && <IdentityDrawer person={open} onClose={() => setOpenId(null)} action={action} />}
    </div>
  );
}

function PersonRow({ person, onClick, note }: { person: AdminPerson; onClick: () => void; note?: string }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-4 border-b border-border px-5 py-4 text-left transition-colors last:border-0 hover:bg-muted/60">
      <div className="grid size-10 shrink-0 place-items-center rounded-md bg-steel-soft font-mono text-[11px] text-steel">{person.initials}</div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium">{person.name}</div>
        <div className="mt-1 truncate text-xs text-muted-foreground">{person.stack} · {person.city} · {person.experience} · {note ?? lockChip(person)}</div>
      </div>
      <span className="hidden font-mono text-[11px] text-steel sm:block">{person.requirement}</span>
      <Chip tone={person.column === "No match" ? "signal" : "ok"}>{person.column}</Chip>
      <ChevronRight className="size-4 text-muted-foreground" />
    </button>
  );
}

export function AdminCampaignsScreen({ action }: { action: Action }) {
  const [view, setView] = useState<{ mode: "list" } | { mode: "detail"; id: string } | { mode: "new" }>({ mode: "list" });
  const [openId, setOpenId] = useState<string | null>(null);
  const open = openId ? findPerson(openId) : undefined;

  if (view.mode === "new") return <NewCampaignPage onBack={() => setView({ mode: "list" })} action={action} />;

  if (view.mode === "detail") {
    const campaign = adminCampaigns.find((item) => item.id === view.id);
    if (!campaign) return null;
    const hits = campaign.hitIds.map((id) => findPerson(id)).filter(Boolean) as AdminPerson[];
    return (
      <div className="space-y-5">
        <button type="button" onClick={() => setView({ mode: "list" })} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="size-3.5" /> All campaigns</button>
        <Heading eyebrow={`${campaign.id} · ${campaign.status}`} title={`${campaign.name} extracted list.`} description={`${campaign.brief} Every profile below is unconfirmed until YZI confirms the email.`}>
          <div className="rounded-md bg-steel-soft px-3 py-2 font-mono text-[10px] tracking-wide text-steel">{campaign.city.toUpperCase()} · {campaign.dates.toUpperCase()}</div>
        </Heading>
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div className="text-sm font-semibold">Extracted profiles</div>
            <span className="font-mono text-[10px] tracking-widest text-muted-foreground">{hits.length} HITS</span>
          </div>
          {hits.length === 0 ? (
            <p className="px-5 py-8 text-sm text-muted-foreground">This campaign has not extracted any profiles yet.</p>
          ) : (
            hits.map((person) => <PersonRow key={person.id} person={person} onClick={() => setOpenId(person.id)} note={`extract · ${campaign.name}`} />)
          )}
        </div>
        {open && <IdentityDrawer person={open} onClose={() => setOpenId(null)} action={action} footer="confirm" />}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Heading eyebrow="YZI ADMIN · CAMPAIGNS" title="Campaigns only when the pool is thin." description="Open a running campaign to work the full extracted list. Nothing reaches a recruiter until YZI confirms it.">
        <Button onClick={() => setView({ mode: "new" })}><Plus className="size-4" /> Start new campaign</Button>
      </Heading>
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        {adminCampaigns.map((campaign) => (
          <button key={campaign.id} type="button" onClick={() => setView({ mode: "detail", id: campaign.id })} className="flex w-full items-center gap-4 border-b border-border px-5 py-4 text-left transition-colors last:border-0 hover:bg-muted/60">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium">{campaign.name}</div>
              <div className="mt-1 truncate text-xs text-muted-foreground">{campaign.id} · {campaign.city} · {campaign.dates}</div>
            </div>
            <span className="hidden text-xs text-muted-foreground sm:block">{campaign.hitIds.length} extracted</span>
            <Chip tone={campaign.status === "RUNNING" ? "ok" : campaign.status === "DRAFT" ? "signal" : "steel"}>{campaign.status}</Chip>
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
}

function Labelled({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-xs font-medium">{label}<div className="mt-2">{children}</div></label>;
}

function Toggle({ label, note, defaultOn }: { label: string; note: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(Boolean(defaultOn));
  return (
    <button type="button" onClick={() => setOn(!on)} className="flex w-full items-center gap-3 rounded-md border border-border p-3 text-left transition-colors hover:bg-muted/60">
      <span className={cn("relative h-5 w-9 shrink-0 rounded-full transition-colors", on ? "bg-ok" : "bg-muted")}>
        <span className={cn("absolute top-0.5 size-4 rounded-full bg-card transition-all", on ? "left-[18px]" : "left-0.5")} />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-medium">{label}</span>
        <span className="mt-0.5 block text-[11px] text-muted-foreground">{note}</span>
      </span>
    </button>
  );
}

function NewCampaignPage({ onBack, action }: { onBack: () => void; action: Action }) {
  const [skills, setSkills] = useState([".NET", "Azure"]);
  const [draft, setDraft] = useState("");
  return (
    <div className="space-y-5">
      <button type="button" onClick={onBack} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="size-3.5" /> All campaigns</button>
      <Heading eyebrow="YZI ADMIN · NEW CAMPAIGN" title="Full HR brief." description="Sera only sources what this brief allows. No brief, no extraction." />
      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <section className="space-y-5 rounded-lg border border-border bg-card p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Labelled label="Role"><Input defaultValue="Senior .NET Engineer" /></Labelled>
            <Labelled label="Target city"><Input defaultValue="Bengaluru" /></Labelled>
            <Labelled label="Age band"><Input defaultValue="24 – 38" /></Labelled>
            <Labelled label="Experience"><Input defaultValue="5 – 8 years" /></Labelled>
            <Labelled label="CTC band"><Input defaultValue="₹18 – ₹28 LPA" /></Labelled>
            <Labelled label="Notice period"><Input defaultValue="Up to 60 days" /></Labelled>
            <Labelled label="Start date"><Input type="date" defaultValue="2026-09-01" /></Labelled>
            <Labelled label="End date"><Input type="date" defaultValue="2026-09-30" /></Labelled>
          </div>
          <div>
            <div className="text-xs font-medium">Skill chips</div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {skills.map((skill) => (
                <span key={skill} className="flex items-center gap-1.5 rounded-full bg-steel-soft px-2.5 py-1 text-[11px] font-medium text-steel">
                  {skill}
                  <button type="button" aria-label={`Remove ${skill}`} onClick={() => setSkills(skills.filter((item) => item !== skill))}><X className="size-3" /></button>
                </span>
              ))}
              <Input
                value={draft}
                placeholder="Add skill + Enter"
                className="h-8 w-40"
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => { if (event.key === "Enter" && draft.trim()) { event.preventDefault(); setSkills([...skills, draft.trim()]); setDraft(""); } }}
              />
            </div>
          </div>
          <Labelled label="Brief note for Sera"><Textarea rows={3} defaultValue="Product engineering teams only. Exclude staffing firms." /></Labelled>
        </section>

        <section className="space-y-5">
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="text-sm font-semibold">Must-haves</div>
            <div className="mt-3 space-y-2">
              <Toggle label="Email required" note="Skip profiles without a reachable email" defaultOn />
              <Toggle label="Phone required" note="Contact stays with YZI either way" defaultOn />
              <Toggle label="Verified profiles only" note="Work history checked" defaultOn />
              <Toggle label="Exclude house pool" note="Do not re-extract people already with YZI" />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="text-sm font-semibold">Portals</div>
            <div className="mt-3 space-y-2">
              <Toggle label="Portal A" note="Public job board sourcing" defaultOn />
              <Toggle label="Portal B" note="Professional network sourcing" />
              <Toggle label="Referral network" note="YZI partner desks" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => { action("Campaign saved as draft"); onBack(); }}>Save draft</Button>
            <Button className="flex-1" onClick={() => { action("Campaign started · Sera is extracting"); onBack(); }}>Start campaign</Button>
          </div>
        </section>
      </div>
    </div>
  );
}

export function AdminRequirementsScreen({ action }: { action: Action }) {
  const [openReq, setOpenReq] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const open = openId ? findPerson(openId) : undefined;
  const requirement = adminRequirements.find((item) => item.id === openReq);

  if (requirement) {
    const matches = requirement.matchIds.map((id) => findPerson(id)).filter(Boolean) as AdminPerson[];
    return (
      <div className="space-y-5">
        <button type="button" onClick={() => setOpenReq(null)} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="size-3.5" /> All requirements</button>
        <Heading eyebrow={`${requirement.id} · ${requirement.desk}`} title={`${requirement.role}, ${requirement.city}.`} description={`Filed ${requirement.filed}. Matched candidates below — open anyone for full identity and to send the spec.`}>
          <Chip tone={requirement.status === "Pool thin" ? "signal" : "ok"}>{requirement.status}</Chip>
        </Heading>
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          {matches.map((person) => <PersonRow key={person.id} person={person} onClick={() => setOpenId(person.id)} />)}
        </div>
        {open && <IdentityDrawer person={open} onClose={() => setOpenId(null)} action={action} />}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Heading eyebrow="YZI ADMIN · REQUIREMENTS" title="Requirements from hiring desks." description="Open a requirement to see exactly who Sera matched. Pool-thin rows become campaign drafts." />
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        {adminRequirements.map((item) => (
          <button key={item.id} type="button" onClick={() => setOpenReq(item.id)} className="flex w-full items-center gap-4 border-b border-border px-5 py-4 text-left transition-colors last:border-0 hover:bg-muted/60">
            <span className="font-mono text-[11px] font-medium text-steel">{item.id}</span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium">{item.role}</div>
              <div className="mt-1 truncate text-xs text-muted-foreground">{item.city} · {item.desk} · filed {item.filed}</div>
            </div>
            <span className="hidden text-xs text-muted-foreground sm:block">{item.matchIds.length} matched</span>
            <Chip tone={item.status === "Pool thin" ? "signal" : item.status === "In workflow" ? "steel" : "ok"}>{item.status}</Chip>
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
}

const seraStages = ["Profile", "Sent", "Meeting", "Docs", "Interview", "Offer", "Placed"];

export function AdminSeraControl({ action }: { action: Action }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [stageOverride, setStageOverride] = useState<Record<string, string>>({});
  const person = selected ? findPerson(selected) : undefined;
  const currentStage = person ? (stageOverride[person.id] ?? (seraStages.includes(person.step) ? person.step : "Profile")) : "Profile";
  const currentIndex = seraStages.indexOf(currentStage);
  const nextStage = seraStages[currentIndex + 1];
  return (
    <div className="space-y-5">
      <Heading eyebrow="YZI ADMIN · SERA CONTROL" title="Sera is powerful because YZI is the lock." description="Pick the person first. Only then does an action unlock, and only that action is logged." />
      <div className="grid gap-5 lg:grid-cols-[1fr_1.3fr]">
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="border-b border-border px-5 py-3 text-sm font-semibold">Select a candidate</div>
          {adminPool.map((item) => (
            <button key={item.id} type="button" onClick={() => setSelected(item.id)} className={cn("flex w-full items-center gap-3 border-b border-border px-5 py-3 text-left transition-colors last:border-0 hover:bg-muted/60", selected === item.id && "bg-steel-soft/70")}>
              <div className="grid size-8 place-items-center rounded-md bg-muted font-mono text-[10px] text-steel">{item.initials}</div>
              <div className="min-w-0">
                <div className="truncate text-[13px] font-medium">{item.name}</div>
                <div className="font-mono text-[10px] text-muted-foreground">{item.requirement} · {item.step}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          {person ? (
            <>
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-md bg-signal-soft text-signal"><LockKeyhole className="size-5" /></div>
                <div>
                  <div className="text-sm font-semibold">{person.name}</div>
                  <div className="font-mono text-[10px] tracking-widest text-muted-foreground">{person.id} · {person.requirement} · STEP {currentStage.toUpperCase()}</div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{person.seraNote}</p>
              <div className="mt-6 space-y-2">
                <Button className="w-full" onClick={() => action(`Spec sent to recruiter · ${person.name}`)}><Send className="size-4" /> Send spec to recruiter (contact hidden)</Button>
                <Button variant="outline" className="w-full" onClick={() => action(`Documents shared with recruiter · ${person.name}`)}><Share2 className="size-4" /> Share documents with recruiter</Button>
              </div>
              <div className="mt-6 rounded-md border border-border bg-muted/30 p-4">
                <div className="font-mono text-[10px] tracking-widest text-muted-foreground">UNLOCK · STAGES</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {seraStages.map((stage, index) => (
                    <span key={stage} className={cn("rounded-full px-2.5 py-1 text-[11px] font-medium", index === currentIndex ? "bg-signal-soft text-signal ring-1 ring-signal" : index < currentIndex ? "bg-ok-soft text-ok" : "bg-steel-soft/60 text-muted-foreground")}>{stage}</span>
                  ))}
                </div>
                <Button variant="outline" className="mt-4 w-full" disabled={!nextStage} onClick={() => { if (!nextStage) return; setStageOverride((map) => ({ ...map, [person.id]: nextStage })); action(`${person.name} unlocked to ${nextStage}`); }}>
                  <LockKeyhole className="size-4" /> {nextStage ? `Unlock ${nextStage}` : "Final stage reached"}
                </Button>
              </div>

              <p className="mt-4 text-[11px] text-muted-foreground">Every action here writes one insert-only audit row.</p>
            </>
          ) : (
            <div className="grid h-full min-h-[220px] place-items-center text-center">
              <div>
                <div className="mx-auto grid size-10 place-items-center rounded-md bg-muted text-muted-foreground"><LockKeyhole className="size-5" /></div>
                <p className="mt-3 max-w-xs text-sm text-muted-foreground">Select a candidate on the left to unlock Send spec, Share docs and stage controls.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AdminMessages({ action }: { action: Action }) {
  const [side, setSide] = useState<"recruiter" | "candidate">("recruiter");
  const threads = useMemo(() => adminThreads.filter((thread) => thread.side === side), [side]);
  const [activeId, setActiveId] = useState(threads[0]?.id ?? "");
  const active = threads.find((thread) => thread.id === activeId) ?? threads[0];
  const [reply, setReply] = useState("");

  return (
    <div className="space-y-5">
      <Heading eyebrow="YZI ADMIN · SECURE INBOX" title="Messages." description="YZI sits between both sides. Recruiters and candidates never talk to each other." />
      <div className="inline-flex rounded-md border border-border p-1">
        {(["recruiter", "candidate"] as const).map((tab) => (
          <button key={tab} type="button" onClick={() => { setSide(tab); setActiveId(adminThreads.find((thread) => thread.side === tab)?.id ?? ""); }} className={cn("rounded px-4 py-1.5 text-xs font-medium capitalize transition-colors", side === tab ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>{tab}</button>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.4fr]">
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          {threads.map((thread) => (
            <button key={thread.id} type="button" onClick={() => setActiveId(thread.id)} className={cn("flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors last:border-0 hover:bg-muted/60", active?.id === thread.id && "bg-steel-soft/60")}>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-medium">{thread.title}</div>
                <div className="mt-1 truncate font-mono text-[10px] text-muted-foreground">{thread.meta}</div>
              </div>
              {thread.unread > 0 && <span className="grid size-4 place-items-center rounded-full bg-signal font-mono text-[9px] text-primary-foreground">{thread.unread}</span>}
            </button>
          ))}
        </div>
        <div className="flex min-h-[360px] flex-col overflow-hidden rounded-lg border border-border bg-card">
          {active ? (
            <>
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div className="text-sm font-semibold">{active.title}</div>
                <span className="font-mono text-[10px] tracking-wider text-muted-foreground">{active.meta}</span>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
                {active.messages.map((message, index) => {
                  const mine = message.from === "YZI Admin";
                  return (
                    <div key={index} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                      <div className={cn("max-w-[80%] rounded-lg px-3.5 py-2.5", mine ? "bg-primary text-primary-foreground" : "bg-muted")}>
                        <div className={cn("font-mono text-[9px] tracking-widest", mine ? "text-sidebar-foreground" : "text-muted-foreground")}>{mine ? "YOU · YZI" : message.from.toUpperCase()} · {message.time}</div>
                        <p className="mt-1.5 text-sm leading-relaxed">{message.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 border-t border-border px-4 py-3">
                <Input value={reply} onChange={(event) => setReply(event.target.value)} placeholder={`Reply to ${active.title}`} />
                <Button onClick={() => { if (reply.trim()) { action(`Message sent to ${active.title}`); setReply(""); } }}><Send className="size-4" /></Button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
