# SERA / YZI

India recruitment OS demo: three safe desks, one mediator. Candidate, Recruiter,
and YZI Admin workflows are filled with mock data and connected by a shared
in-memory demo store.

## UI + mock walkthrough

- `/` — Demo map / desk selection
- `/candidate` — personal candidate home, My roles, documents, profile, and YZI messages
- `/recruiter` — requirements, protected candidate pool, workflow, and YZI messages
- `/admin` — command center, pool kanban, campaigns, approvals, Sera control, audit log
- Recruiter → Candidate pool → select Rahul Mehta → Accept into workflow. The Candidate desk's My roles journey updates from the shared mock store.
- Contact details are only shown in the Admin pool detail state. Recruiter views always keep them hidden.

This step intentionally uses no live authentication, scraping, or external
recruiter APIs. Login behavior and operations can be connected later by Claude
Code using the schema and API contracts in `supabase/migrations/0001_sera.sql`,
`src/types/db.ts`, and `src/api/stubs.ts`.

## Build with Lovable

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS
