# Edinburgh SFF Hub — CLAUDE.md

## Project Overview

A rebuild of [edinburghsff.com](https://edinburghsff.com) — the Edinburgh Science Fiction and Fantasy writing community site. The primary feature is a map of local writing venues and resources. Supplementary content pages (about, events, resources etc.) are driven by markdown stored in Firebase Firestore.

**Reference implementation:** The original site source lives at `/Users/shellbryson/Development/EdinburghSFF/edinburghsff` (React + Vite + MUI). Consult it for design decisions, component behaviour, and Firestore field names before building anything new.

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
| **lucide-react** | Icons (replaces MUI Icons from the original site) |
| **Vercel** | Deployment |

---

## Design Reference

The rebuild follows the visual design of the original site. Key values to use consistently:

### Colours

| Token | Hex | Usage |
|-------|-----|-------|
| Brand yellow | `#fded07` | Headings, borders, active states, brand accent |
| Background | `#000000` | Page background |
| Faint background | `#1b1a01` | Modal / panel backgrounds |
| Text primary | `#f2f2f2` | Body text |
| Highlight | `#27260d` | h2 backgrounds, facility bars, borders |
| Secondary | `#05d7f2` | Accent (use sparingly) |

**Map pin colours by location type:**

| Type | Hex |
|------|-----|
| Venue | `#c184f8` |
| Cafe | `#62bae3` |
| Library | `#8cd672` |
| Bookshop | `#d69372` |
| Interesting / default | `#ffffff` |

### Typography

- **Headings:** `'Chakra Petch', sans-serif` — uppercase, weight 400
- **Body / mono:** `'Fira Code', monospace` — weight 400/600

Both are Google Fonts. Import them in `src/app/layout.tsx` and expose as CSS variables (`--font-heading`, `--font-body`).

### Layout

- Full-viewport split: collapsible left panel (300 px expanded / 10 px collapsed) + full-screen Google Map on the right
- Panel toggle: smooth 200 ms transition; blurs on mobile when open
- Modals: max-width `sm`, full-screen on mobile, dark background, `#27260d` border, 4 px yellow corner dots (top-right + bottom-left)

---

## Firestore Schema

### `locations` collection

| Field | Type | Notes |
|-------|------|-------|
| `title` | string | Short display name |
| `title_long` | string? | Full name — shown in modal heading |
| `name_short` | string? | Abbreviated name for map pin label |
| `lat` | number \| GeoPoint | Latitude (see `parseCoords` in `locations.ts`) |
| `lng` | number \| GeoPoint | Longitude |
| `tags` | string? | Comma-separated type(s): `"Venue"`, `"Cafe"`, `"Library"`, `"Bookshop"`, `"Interesting"` |
| `facilities` | string? | Comma-separated: `"Coffee"`, `"Alcohol"`, `"Meal"`, `"Food"`, `"Wifi"`, `"Power"`, `"Pet"` |
| `hours` | string? | Comma-separated opening hours strings |
| `description` | string? | Markdown |
| `tips` | string? | Markdown |
| `price` | number? | Out of 10 |
| `noise` | number? | Out of 10 |
| `image` | string? | Image URL |
| `address` | string? | |
| `url` | string? | |

### `pages` collection

| Field | Type | Notes |
|-------|------|-------|
| `slug` | string | URL path segment (e.g. `"about"`, `"faq"`) |
| `title` | string | Page title |
| `content` | string | Markdown body |
| `description` | string? | Meta description |

### `events` collection

| Field | Type | Notes |
|-------|------|-------|
| `title` | string | |
| `summary` | string? | Short description |
| `content` | string? | Markdown body |
| `eventStart` | Timestamp | |
| `eventEnd` | Timestamp? | |
| `allDay` | boolean? | |
| `image` | string? | Image URL |

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
      VenueMap.tsx      # Map root — APIProvider, Map, markers, modal wiring
      MapPin.tsx        # Custom AdvancedMarker content — type-coloured pin
      LocationModal.tsx # Location detail overlay
    layout/             # Header, footer, nav
  lib/
    firebase/
      config.ts         # Firebase app init (client SDK)
      locations.ts      # Firestore locations subscription
      auth.ts           # Auth helpers
    utils.ts            # shadcn cn() utility
  hooks/                # Custom client-side hooks
  types/                # Shared TypeScript interfaces
    location.ts         # Location interface (matches Firestore schema above)
```

---

## Development Commands

```bash
npm run dev        # Start dev server (http://localhost:5173)
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

| Variable | Used by |
|----------|---------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase client SDK |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase client SDK |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase client SDK |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase client SDK |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase client SDK |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase client SDK |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Firebase client SDK |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | `@vis.gl/react-google-maps` |
| `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` | Google Maps styled map ID |
| `FIREBASE_ADMIN_*` | Server-only — Admin SDK (never `NEXT_PUBLIC_`) |

---

## Key Patterns

### Map pins (locations)
- Stored in the `locations` Firestore collection
- Fetched client-side via `onSnapshot` in `src/lib/firebase/locations.ts`
- `VenueMap` holds `locations` state and `selected` state
- `MapPin` renders inside `AdvancedMarker` — pin colour and icon driven by `tags` field
- `LocationModal` is rendered outside the `Map` so it sits above the map canvas
- Pin CSS (`.map-pin`, `.map-pin-icon`) lives in `src/app/globals.css`
- Modal CSS (`.location-modal` corner dots) also in `globals.css`

### Adding a public content page (from Firestore)
1. Pages are fetched by slug from the `pages` Firestore collection
2. `src/app/[slug]/page.tsx` handles all content routes
3. Export `generateMetadata` to set title/description from Firestore data
4. Render markdown with `react-markdown`

### Adding a new admin section
1. Create `src/app/admin/[section]/page.tsx`
2. It's automatically behind the auth guard in `src/app/admin/layout.tsx`
3. Use `useEffect` + `useState` for data fetching, or Server Actions for mutations

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
- When in doubt about design details, consult the reference implementation at `/Users/shellbryson/Development/EdinburghSFF/edinburghsff`.
