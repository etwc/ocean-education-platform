# Ocean Education Vercel Deployment

## Local Verification

Run these before every production deploy:

```bash
npm run lint
npm run typecheck
npm run build
```

## GitHub Setup

From the `ocean-education` project root:

```bash
git init
git add .
git commit -m "Initial Ocean Education platform MVP"
git branch -M main
```

Create a GitHub repository, then push:

```bash
git remote add origin https://github.com/YOUR_USERNAME/ocean-education-platform.git
git push -u origin main
```

If GitHub CLI is installed and authenticated:

```bash
gh repo create ocean-education-platform --public --source=. --remote=origin --push
```

## Vercel Settings

Import the GitHub repository in Vercel.

- Framework preset: `Next.js`
- Root directory: `.`
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: leave empty / Vercel default

The project includes `vercel.json` so Vercel can detect the intended build settings.

## Environment Variables

For demo-only deployment, Supabase variables can be omitted.

For real Supabase auth, add these in Vercel Project Settings:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Vercel CLI Deploy

If Vercel CLI is available:

```bash
npx vercel login
npx vercel link
npx vercel --prod
```

The production URL printed by `npx vercel --prod` is the public demo URL.

## Automatic Deployment

After importing the GitHub repository into Vercel:

- Pushes to `main` trigger production deployments.
- Pull requests trigger preview deployments.
- Environment variables are managed in the Vercel dashboard.
