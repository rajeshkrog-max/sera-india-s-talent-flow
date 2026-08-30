import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SERA / YZI — India Recruitment OS" },
      { name: "description", content: "A mediated India recruitment operating system: candidates progress, recruiters hire, YZI keeps contact private." },
      { property: "og:title", content: "SERA / YZI — India Recruitment OS" },
      { property: "og:description", content: "Pool-first recruiting, mediated by YZI and powered by Sera." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const bullets = [
  "Candidate and recruiter never exchange contact",
  "Pool first — a campaign only when the pool is thin",
  "Every sensitive click is audit-logged by YZI",
  "One requirement code follows the whole hire",
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <header className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-6 md:px-10">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-md bg-rail font-mono text-xs text-sidebar-primary">S</div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">SERA <span className="font-normal text-muted-foreground">/ YZI</span></div>
            <div className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground">INDIA RECRUITMENT OS</div>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <Link to="/login" search={{ desk: "admin" }} className="text-[13px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">YZI Admin sign in</Link>
          <Link to="/signup" className="hidden text-[13px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline sm:block">Create candidate profile</Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-[1200px] items-center gap-14 px-6 pb-24 pt-10 md:grid-cols-2 md:px-10 md:pt-16">
        <div className="sera-rise">
          <div className="font-mono text-[11px] tracking-[0.22em] text-primary">ONE MEDIATOR · THREE DESKS</div>
          <h1 className="mt-5 text-[44px] font-semibold leading-[1.02] tracking-tight md:text-[64px]">
            Hiring that stays
            <br />private by design.
          </h1>
          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-muted-foreground">
            Sera is the engine. YZI is the lock. Candidates get one clear next move, recruiters get a vetted pool — and identity, documents and contact never cross the line.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full px-6"><Link to="/login" search={{ desk: "candidate" }}>I'm a candidate <ArrowRight className="size-4" /></Link></Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-foreground/20 bg-card px-6"><Link to="/login" search={{ desk: "recruiter" }}>I'm a recruiter</Link></Button>
          </div>

          <ul className="mt-12 space-y-3 border-t border-border pt-8">
            {bullets.map((line) => (
              <li key={line} className="flex items-start gap-3 text-[14px] text-muted-foreground">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={2.2} />
                {line}
              </li>
            ))}
          </ul>
        </div>

        <MockPanel />
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-6 py-6 font-mono text-[10px] tracking-widest text-muted-foreground md:px-10">
          <span className="flex items-center gap-2"><ShieldCheck className="size-3.5 text-ok" /> CONTACT NEVER SHARED WITH RECRUITER</span>
          <span>SERA / YZI · DEMO 01 · INDIA 2026</span>
        </div>
      </footer>
    </div>
  );
}

const steps = [
  { label: "Requirement", note: "REQ-104 filed" },
  { label: "Pool match", note: "6 matched" },
  { label: "Spec sent", note: "contact hidden" },
  { label: "Interview", note: "scheduled" },
  { label: "Placed", note: "audit closed" },
];

function MockPanel() {
  return (
    <div className="sera-rise rounded-xl border border-border bg-card p-5 shadow-[0_24px_60px_-30px_rgba(17,17,17,0.35)] md:p-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-muted-foreground/25" />
          <span className="size-2.5 rounded-full bg-muted-foreground/25" />
          <span className="size-2.5 rounded-full bg-muted-foreground/25" />
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-primary"><span className="size-1.5 rounded-full bg-primary" /> SERA RUNNING</span>
      </div>

      <div className="mt-5 font-mono text-[10px] tracking-[0.18em] text-muted-foreground">SENIOR .NET ENGINEER · REQ-104 · LIVE</div>

      <div className="mt-4 grid grid-cols-5 gap-2">
        {steps.map((step, index) => (
          <div key={step.label} className="text-center">
            <div className={index === 2 ? "grid h-12 place-items-center rounded-md border border-primary bg-signal-soft font-mono text-[11px] text-primary" : "grid h-12 place-items-center rounded-md border border-border bg-background font-mono text-[11px] text-muted-foreground"}>
              {index + 1}
            </div>
            <div className={index === 2 ? "mt-2 text-[11px] font-medium text-primary" : "mt-2 text-[11px] font-medium text-foreground"}>{step.label}</div>
            <div className="text-[10px] leading-tight text-muted-foreground">{step.note}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-md border border-border bg-background p-3 text-[12px] text-muted-foreground">
        <span className="font-medium text-primary">Lock:</span> spec shared with the hiring desk — phone, email and address withheld.
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <Metric value="94%" label="Pool-first fills" />
        <Metric value="6" label="Matched · REQ-104" />
        <Metric value="0" label="Contact leaks" />
      </div>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <div className="text-xl font-semibold tracking-tight">{value}</div>
      <div className="mt-0.5 text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}
