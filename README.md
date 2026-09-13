# Sera: India's Talent Flow

SERA / YZI — one generation. Do not ask me to pick colours or button styles. You choose a world-class UI (Braintrust / Linear / Stripe quality). I only lock the product.

PRODUCT

India recruitment OS. Three portals, one mediator (YZI Admin).

- Candidate never talks to recruiter. Recruiter never sees phone, email, address.

- Pool first. Campaign only if house pool is thin.

- Recruiter files a Requirement (REQ-104). Specs always show that REQ-ID.

- Admin confirms mail, Send spec, shares docs, audit-logs every sensitive click.

- Sera is the engine; Admin is the lock. You do NOT implement real Naukri/LinkedIn APIs.

YOU OWN

Visual design, spacing, type, buttons, empty states, motion, density. Make it feel expensive and calm. Not generic SaaS, not orange circus, not cluttered.

I OWN (do not invent a different product)

Flows, nav, mock data, schema files.

STACK

Vite + React + TS + Tailwind + shadcn. React Router. Push to connected GitHub yzi-sera.

DEMO

Fixed “Demo map” to jump portals without real auth. Mock users. Shared mock store so Recruiter Accept on Rahul updates Candidate “My roles”.

ROUTES — all filled with mock data, no blank pages

Public: / doors (Candidate / Recruiter / Admin) with a clear sentence each.

Logins + Candidate first-time signup (full profile form + photo + CV optional + field → expertise chips + dropdowns). Returning user = login only, no signup form again.

CANDIDATE: Home (journey chip + next action), My roles (milestones with flags: Profile, Review, Sent, Meeting, Docs, Interview, Offer, Placed — later tabs hidden until unlocked), Documents (upload), Profile (NOT signup: photo, Active/Inactive/Blocked chip, identity locked — request change + reason to Admin; work/tags editable), Messages (YZI only, unread), Invite JD (Apply/Reject, why matched, no junk “about employer”).

RECRUITER (Priya / Eventrics): Overview, Requirements (dropdowns + date filed, codes REQ-xxx), Candidate pool MUST show:

  Rahul Mehta · REQ-104 · .NET · YZI pool

  Neha Joshi · REQ-201 · React · campaign Java Pune

Click = full spec, no contact, Accept into workflow / Reject.

Workflow: Ananya already in. Click person. Progress + Proceed reviewed / Meeting done / Docs ok / Ask YZI. Messages = YZI only.

ADMIN: Overview as command center (tabs Candidates | Recruiters, charts, click → progress).

Campaigns list (running / ended / draft) + Start new campaign = full HR brief (role, target city, age, exp, CTC, skills chips, must-have email/phone/verified/exclude-pool, portals, dates). Open campaign = extracted profiles + Confirm email / Reject at bottom.

Requirements from recruiters (pool-thin → campaign DRAFT for Admin to edit then start). Also YZI can start in-house campaign with no REQ.

Pool kanban. Click candidate = full identity WITH contact + Send spec + status.

Approvals, Sera control (unlock + share docs), Audit log (read-only admin actions), Messages.

SCHEMA (files only, no live Supabase auth this step — saves breakage)

/supabase/migrations/0001_sera.sql and /src/types/db.ts:

orgs, users, candidates, requirements, campaigns, hits, specs (NO contact columns), workflows, messages, documents, identity_requests, audit_events (insert-only)

/src/api/stubs.ts with // CLAUDE: matchPool, startCampaign, sendSpec, shareDocs, confirmEmail

README: UI + mock + schema. Claude Code = operations.

NEVER

Real scraping, showing contact to recruiter, empty pool, extra products, waiting for me to choose a palette.

When finished I can walk Demo map through all three desks and nothing looks unfinished.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8660abe2-c6f6-47e2-86e8-72855f8c7f78).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
