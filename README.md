# Ocean Education Platform MVP

A modern education platform MVP for Ocean Education Malaysia. This project is intentionally demo-first: premium UI, smooth UX, role-aware auth, and a clean dashboard foundation before deeper backend workflows.

## Product Direction

The MVP is designed to impress non-technical HR teams, business owners, and education clients. The first build priority is the product surface: polished auth, modern dashboards, gamified learning cues, responsive layouts, and strong motion. Supabase is used as the simple backend layer for auth, database, storage, and realtime features as the product grows.

## Architecture Decision

This is not an enterprise architecture. The app uses a lean Next.js App Router structure:

- App routes own page-level flows.
- Components own reusable product UI.
- Supabase helpers stay small and explicit.
- Demo data powers the visual experience until real tables are connected.
- Role-based auth starts with Supabase user metadata: `admin`, `teacher`, `student`.

This keeps the codebase understandable for a solo developer while leaving enough structure for Phase 2-4.

## Folder Structure

```txt
src/
  app/
    (auth)/
      login/
      register/
      forgot-password/
    (dashboard)/
      dashboard/
        quizzes/
        attendance/
        payments/
        reports/
        settings/
    auth/callback/
    globals.css
    layout.tsx
    page.tsx
  components/
    auth/
    dashboard/
    ui/
  lib/
    auth/
    supabase/
    utils.ts
  types/
```

## Tech Stack

- Next.js 15.5.15
- React 19
- TypeScript
- TailwindCSS 4
- shadcn/ui-style primitives
- Framer Motion
- Lucide Icons
- Supabase
- Recharts

## Phase Plan

Phase 1:
- Next.js setup
- Tailwind and shadcn-style UI primitives
- Supabase auth helpers
- Login, register, forgot password
- Role-aware auth metadata
- Dashboard layout and navigation
- Premium dashboard overview

Phase 2:
- Admin dashboard
- Attendance management by form/class
- Teacher and admin class overview
- Manual attendance editing
- Sidebar and navigation refinements

Phase 3:
- Gamified quiz system
- XP, levels, badges
- Leaderboard
- Animated answer feedback

Phase 4:
- Attendance code check-in
- Academic reports
- Tuition records
- Supabase database tables and realtime polish

## Local Setup

Install dependencies:

```bash
npm install
```

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Run the app:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

Without Supabase keys, the auth screens run in demo mode and route into the dashboard.

## Supabase Notes

For Phase 1, registration stores the selected role in Supabase Auth metadata:

```ts
data: {
  full_name: fullName,
  role: "student" | "teacher" | "admin"
}
```

The dashboard middleware protects `/dashboard` only when Supabase environment variables are configured. This keeps demos frictionless while allowing real auth when keys are added.

## Verification

```bash
npm run lint
npm run typecheck
npm run build
```

## Vercel Deployment

This project is configured for Vercel with `vercel.json`.

Recommended production settings:

- Framework preset: `Next.js`
- Root directory: project root, `ocean-education`
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: leave empty / Vercel default for Next.js

Environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

For a demo-only deployment, the app still works without Supabase keys. Auth runs in demo mode and routes into the dashboard.

GitHub + Vercel flow:

1. Push this project to GitHub.
2. Import the GitHub repository in Vercel.
3. Set the environment variables above if Supabase is connected.
4. Deploy the `main` branch.
5. Every future push to GitHub will auto deploy through Vercel.
