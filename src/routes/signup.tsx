import { useState } from "react";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { publicOpenRoles } from "@/lib/admin-data";

type SignupSearch = { token?: string };

export const Route = createFileRoute("/signup")({
  validateSearch: (search: Record<string, unknown>): SignupSearch => ({
    token: typeof search['token'] === "string" ? (search['token'] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Create your candidate profile — SERA / YZI" },
      { name: "description", content: "First-time candidate signup for the YZI-mediated recruitment desk." },
      { property: "og:title", content: "Create your candidate profile — SERA / YZI" },
      { property: "og:description", content: "One profile. YZI keeps your contact details private from recruiters." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const { token } = useSearch({ from: "/signup" });
  const invited = Boolean(token);
  const [done, setDone] = useState(false);

  return (
    <div className="min-h-screen bg-muted/40 text-foreground">
      <div className="mx-auto w-full max-w-[720px] px-6 py-12">
        <Link to="/" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="size-3.5" /> Back to the doors</Link>

        <div className="mt-6 rounded-lg border border-border bg-card p-8">
          <div className="font-mono text-[10px] tracking-[0.2em] text-signal">CANDIDATE · FIRST TIME</div>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">Create your profile once.</h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            {invited
              ? "You were invited by YZI. Your role match is already attached — just complete your details."
              : "Tell us who you are. YZI holds your contact details; recruiters only ever see your professional profile."}
          </p>

          {done ? (
            <div className="mt-8 rounded-md border border-ok bg-ok-soft p-5 text-sm text-ok">
              Profile submitted. YZI Admin will review and match you to open requirements.
            </div>
          ) : (
            <form
              className="mt-8 space-y-5"
              onSubmit={(event) => { event.preventDefault(); setDone(true); }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Labelled label="First name"><Input required placeholder="Rahul" /></Labelled>
                <Labelled label="Last name"><Input required placeholder="Mehta" /></Labelled>
                <Labelled label="Email"><Input required type="email" placeholder="you@example.com" /></Labelled>
                <Labelled label="Phone"><Input required placeholder="+91 " /></Labelled>
                <Labelled label="City"><Input required placeholder="Bengaluru" /></Labelled>
                <Labelled label="Field"><Input required placeholder="Software engineering" /></Labelled>
              </div>

              {!invited && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Labelled label="How did you hear about us? (optional)">
                    <select className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                      <option value="">Prefer not to say</option>
                      <option value="ad">Ad</option>
                      <option value="referral">Referral</option>
                      <option value="other">Other</option>
                    </select>
                  </Labelled>
                  <Labelled label="Role you are interested in (optional)">
                    <select className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                      <option value="">No specific role</option>
                      {publicOpenRoles.map((role) => (
                        <option key={role.reqId} value={role.reqId}>{role.label}</option>
                      ))}
                    </select>
                  </Labelled>
                </div>
              )}

              <div className="flex items-center gap-2 rounded-md border border-border bg-muted/40 p-4 text-xs text-muted-foreground">
                <ShieldCheck className="size-4 shrink-0 text-ok" />
                Your phone, email and address are never shown to a recruiter. Only YZI Admin can contact you.
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">Create profile</Button>
                <Button type="button" variant="outline" asChild><Link to="/candidate">I already have an account</Link></Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Labelled({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-xs font-medium">{label}<div className="mt-2">{children}</div></label>;
}
