# Edinburgh SFF Hub — CLAUDE.md

## Project Overview

A rebuild of [edinburghsff.com](https://edinburghsff.com) — the Edinburgh Science Fiction and Fantasy writing community site. The primary feature is a map of local writing venues and resources. Supplementary content pages (about, events, resources etc.) are driven by markdown stored in Firebase Firestore.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| **Next.js 16** (App Router) | Framework — SSR, routing, metadata |
| **React 19** | UI |
| **TypeScript** | Strict types throughout |
| **Tailwind CSS v4** | Styling |
| **shadcn/ui** | Component library (built on Radix + Tailwind) |
| **@base-ui/react** | Headless UI primitives |
| **Firebase** (Firestore + Auth) | Data store and authentication |
| **@vis.gl/react-google-maps** | Map rendering on the landing page |
| **react-markdown** | Render markdown content fetched from Firestore |
| **Vercel** | Deployment |

---

## Architecture

### Rendering strategy
- **Public pages** (`/`, `/[slug]`) → Server Components by default. Data is fetched server-side so crawlers and social previews get full HTML.
- **The map** → a `'use client'` component embedded inside a server-rendered page. The page shell and any SEO content are server-rendered; the map hydrates on the client.
- **Admin** (`/admin/*`) → client-heavy, no SSR requirement. Auth is checked server-side in the layout via session cookie.

### Route structure
```
src/app/
  layout.tsx            # Root layout — fonts, providers
  page.tsx              # Landing page (map)
  [slug]/
    page.tsx            # Dynamic markdown content pages from Firestore
  admin/
    layout.tsx          # Server-side session check → redirect to /login
    page.tsx            # Admin dashboard
    login/
      page.tsx          # Login form (outside auth guard)
    locations/          # Manage map pins
    pages/              # Manage markdown content pages
```

### Firebase
- Client SDK config: `src/lib/firebase/config.ts`
- All `NEXT_PUBLIC_FIREBASE_*` env vars are safe to expose to the browser
- Firebase Admin SDK (for privileged server-side reads/writes): use `FIREBASE_ADMIN_*` env vars — **never prefix these with `NEXT_PUBLIC_`**
- Keep all Firestore query functions in `src/lib/firebase/` — not in components

### Admin authentication
- Firebase Auth (email/password) on the client
- On successful login, set a `session` cookie (HttpOnly, Secure) via a Route Handler
- The `/admin/layout.tsx` reads this cookie server-side and redirects to `/admin/login` if absent
- On logout, delete the cookie via the same Route Handler

### Client-side data fetching
- Server Components fetch Firestore data directly — no client state layer needed
- For live-updating client data (e.g. map pins), use Firebase `onSnapshot` in a `useEffect`
- Admin pages use `useEffect` + `useState` for simple data fetching, or Server Actions for mutations
- Next.js `revalidatePath` / `revalidateTag` handles cache invalidation for SSR content

---

## Folder Structure

```
src/
  app/                  # Next.js App Router pages
  components/
    ui/                 # shadcn/ui primitives (auto-generated, don't edit manually)
    map/                # Map and pin components
    layout/             # Header, footer, nav
  lib/
    firebase/
      config.ts         # Firebase app init (client SDK)
      firestore.ts      # Firestore query helpers
      auth.ts           # Auth helpers
    utils.ts            # shadcn cn() utility
  hooks/                # Custom client-side hooks
  types/                # Shared TypeScript interfaces
```

---

## Development Commands

```bash
npm run dev        # Start dev server (http://localhost:3000)
npm run build      # Type-check + production build
npm run lint       # ESLint
```

### Adding shadcn components
```bash
npx shadcn@latest add <component>
# e.g. npx shadcn@latest add dialog table form
```

---

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in values. Never commit `.env.local`.

Key distinction:
- `NEXT_PUBLIC_*` — bundled into the client, safe for Firebase client SDK
- No prefix — server-only, used in Server Components and Route Handlers

---

## Key Patterns

### Adding a public content page (from Firestore)
1. Pages are fetched by slug from the `pages` Firestore collection
2. `src/app/[slug]/page.tsx` handles all content routes
3. Export `generateMetadata` to set title/description from Firestore data
4. Render markdown with `react-markdown` in a client component if interactivity is needed, otherwise inline

### Adding a new admin section
1. Create `src/app/admin/[section]/page.tsx`
2. It's automatically behind the auth guard in `src/app/admin/layout.tsx`
3. Use `useEffect` + `useState` for data fetching, or Server Actions for mutations

### Map pins (locations)
- Stored in the `locations` Firestore collection
- Fetched client-side via Firebase `onSnapshot` so the map updates without navigation
- Map component lives in `src/components/map/`

### Server-side Firestore fetch pattern
```ts
// In a Server Component or generateMetadata
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'

const snap = await getDoc(doc(db, 'collection', id))
if (!snap.exists()) notFound()
const data = snap.data()
```

---

## Guiding Principles

- Default to Server Components. Only add `'use client'` when the component needs browser APIs, event handlers, or React state.
- Keep Firebase query logic in `src/lib/firebase/` — not scattered into components or hooks.
- The map is the hero feature of the landing page — keep it fast.
- Use shadcn/ui or @base-ui/react components before writing custom UI primitives.
- No premature abstractions — build what the current page needs.
