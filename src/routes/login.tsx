import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Desk = "candidate" | "recruiter" | "admin";
type LoginSearch = { desk: Desk };

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    const desk = search["desk"];
    return { desk: desk === "recruiter" || desk === "admin" ? desk : "candidate" };
  },
  head: () => ({
    meta: [
      { title: "Sign in — SERA / YZI" },
      { name: "description", content: "Sign in to your SERA desk. Your desk is chosen at login — candidate, recruiter or YZI Admin." },
      { property: "og:title", content: "Sign in — SERA / YZI" },
      { property: "og:description", content: "One sign in, one desk. YZI mediates everything in between." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

const copy: Record<Desk, { eyebrow: string; title: string; line: string; stats: { value: string; label: string }[]; to: "/candidate" | "/recruiter" | "/admin" }> = {
  candidate: {
    eyebrow: "WELCOME BACK",
    title: "One desk. One clear next move.",
    line: "Your profile lands in front of vetted hiring desks. YZI holds your contact details — recruiters never see them.",
    stats: [
      { value: "3,586", label: "OPEN ROLES" },
      { value: "8", label: "MILESTONES" },
      { value: "0", label: "COLD CALLS" },
    ],
    to: "/candidate",
  },
  recruiter: {
    eyebrow: "HIRING DESK",
    title: "File a requirement. Hire from the pool.",
    line: "Specs arrive with the REQ-ID attached and contact withheld. Accept into workflow and YZI handles the rest.",
    stats: [
      { value: "4,424", label: "POOL PROFILES" },
      { value: "94%", label: "POOL-FIRST FILLS" },
      { value: "REQ", label: "CODED END TO END" },
    ],
    to: "/recruiter",
  },
  admin: { eyebrow: "MEDIATOR", title: "YZI Admin", line: "", stats: [], to: "/admin" },
};

function LoginPage() {
  const { desk } = useSearch({ from: "/login" });
  const navigate = useNavigate();
  const meta = copy[desk];

  const form = (
    <form
      className="w-full max-w-[420px]"
      onSubmit={(event) => { event.preventDefault(); navigate({ to: meta.to }); }}
    >
      <h2 className="text-2xl font-semibold tracking-tight">Sign in</h2>
      <p className="mt-2 text-[13px] text-muted-foreground">
        {desk === "admin" ? "Mediator access. Every action here is audit-logged." : "Demo sign in — any details work."}
      </p>

      <label className="mt-7 block text-[13px] font-medium">Email address
        <Input className="mt-2 h-11 bg-background" required type="email" placeholder="you@example.com" />
      </label>
      <label className="mt-5 block text-[13px] font-medium">Password
        <Input className="mt-2 h-11 bg-background" required type="password" placeholder="••••••••••" />
      </label>

      <Button type="submit" size="lg" className="mt-7 h-11 w-full rounded-full">
        Sign in <ArrowRight className="size-4" />
      </Button>

      {desk === "candidate" && (
        <p className="mt-6 text-center text-[13px] text-muted-foreground">
          New here? <Link to="/signup" className="font-medium text-primary underline-offset-4 hover:underline">Create your profile.</Link>
        </p>
      )}
      <p className="mt-4 text-center text-[12px] text-muted-foreground">
        <Link to="/" className="underline-offset-4 hover:text-foreground hover:underline">Back to home</Link>
      </p>
    </form>
  );

  if (desk === "admin") {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-6 text-foreground antialiased">
        <div className="sera-rise w-full max-w-[460px] rounded-xl border border-border bg-card p-8 md:p-10">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-md bg-rail font-mono text-xs text-sidebar-primary">S</div>
            <div className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">YZI ADMIN · MEDIATOR</div>
          </div>
          <div className="mt-8">{form}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground antialiased md:grid md:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 md:px-14">
        <div className="sera-rise max-w-md">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-md bg-rail font-mono text-xs text-sidebar-primary">S</div>
            <span className="text-sm font-semibold tracking-tight">SERA <span className="font-normal text-muted-foreground">/ YZI</span></span>
          </Link>
          <div className="mt-12 font-mono text-[11px] tracking-[0.22em] text-primary">{meta.eyebrow}</div>
          <h1 className="mt-4 text-[38px] font-semibold leading-[1.05] tracking-tight md:text-[48px]">{meta.title}</h1>
          <p className="mt-5 text-[16px] leading-relaxed text-muted-foreground">{meta.line}</p>

          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-8">
            {meta.stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-semibold tracking-tight">{stat.value}</div>
                <div className="mt-1 font-mono text-[10px] tracking-widest text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-2 font-mono text-[10px] tracking-widest text-muted-foreground">
            <ShieldCheck className="size-3.5 text-ok" /> CONTACT STAYS WITH YZI
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center border-t border-border bg-card px-6 py-14 md:border-l md:border-t-0 md:py-0">
        {form}
      </div>
    </div>
  );
}
