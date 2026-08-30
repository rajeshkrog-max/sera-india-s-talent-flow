import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, LockKeyhole, ShieldCheck, UserRound, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SeraApp } from "@/components/sera-app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SERA / YZI — India Recruitment OS" },
      { name: "description", content: "A secure India recruitment operating system with Candidate, Recruiter, and YZI Admin desks." },
      { property: "og:title", content: "SERA / YZI — India Recruitment OS" },
      { property: "og:description", content: "Pool-first recruiting, mediated by YZI and powered by Sera." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <div className="min-h-screen bg-rail text-sidebar-primary"><div className="mx-auto flex min-h-screen max-w-[1440px] flex-col px-6 py-6 md:px-10 md:py-10"><header className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-md bg-sidebar-accent font-mono text-sm ring-1 ring-sidebar-border">S</div><div><div className="text-sm font-semibold tracking-tight">SERA <span className="font-normal text-rail-text">/ YZI</span></div><div className="font-mono text-[10px] tracking-[0.18em] text-rail-text">INDIA RECRUITMENT OS</div></div></div><div className="flex items-center gap-3"><span className="hidden rounded-md border border-sidebar-border px-3 py-2 font-mono text-[10px] tracking-widest text-rail-text sm:block">DEMO MAP</span><Button variant="rail" size="sm" asChild><Link to="/admin">Open command center <ArrowUpRight className="size-3.5" /></Link></Button></div></header><div className="flex flex-1 items-center py-16 md:py-24"><div className="w-full"><div className="max-w-2xl"><div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-signal"><span className="size-1.5 rounded-full bg-signal" /> ONE MEDIATOR · THREE SAFE DESKS</div><h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.06] tracking-tight md:text-6xl">Recruitment, with a lock on every sensitive click.</h1><p className="mt-6 max-w-xl text-base leading-relaxed text-rail-text">Sera is the engine. YZI is the lock. Candidates and recruiters get a clear next move — while identity, documents, and contact stay protected.</p></div><div className="mt-14 grid gap-4 md:grid-cols-3"><DoorCard to="/candidate" icon={UserRound} label="Candidate" copy="Your single safe desk to progress and get placed." cta="Enter candidate desk" /><DoorCard to="/recruiter" icon={Users} label="Recruiter" copy="File requirements and accept from the vetted pool." cta="Enter recruiter desk" /><DoorCard to="/admin" icon={LockKeyhole} label="YZI Admin" copy="The mediator that confirms, shares, and audits." cta="Enter admin desk" featured /></div><div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-sidebar-border pt-5 font-mono text-[10px] tracking-widest text-rail-text"><span className="flex items-center gap-2"><ShieldCheck className="size-3.5 text-ok" />CONTACT NEVER SHARED WITH RECRUITER</span><span>POOL FIRST · CAMPAIGN IF THIN</span><span>MOCK MAP · NO REAL API</span></div></div></div><footer className="flex items-center justify-between border-t border-sidebar-border pt-5 text-[11px] text-rail-text"><span>SERA / YZI · DEMO 01</span><span>India · 2026</span></footer></div></div>;
}

function DoorCard({ to, icon: Icon, label, copy, cta, featured }: { to: "/candidate" | "/recruiter" | "/admin"; icon: typeof UserRound; label: string; copy: string; cta: string; featured?: boolean }) { return <Link to={to} className={`group rounded-lg border p-5 transition-all hover:-translate-y-1 hover:shadow-2xl ${featured ? "border-signal bg-sidebar-accent" : "border-sidebar-border bg-rail-soft"}`}><div className={`grid size-10 place-items-center rounded-md ${featured ? "bg-signal text-primary-foreground" : "bg-sidebar-accent text-rail-text"}`}><Icon className="size-5" /></div><div className="mt-8 flex items-end justify-between gap-4"><div><div className="text-base font-semibold">{label}</div><p className="mt-2 max-w-[26ch] text-sm leading-relaxed text-rail-text">{copy}</p></div><ArrowUpRight className="size-5 shrink-0 text-rail-text transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></div><div className="mt-8 border-t border-sidebar-border pt-3 font-mono text-[10px] tracking-[0.08em] text-signal">{cta} →</div></Link>; }

