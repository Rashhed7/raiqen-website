# RAIQEN — Intelligence. Engineered for Business.

RAIQEN builds AI-powered products, intelligent software, and automated systems for modern businesses. This repository contains the official RAIQEN marketing site.

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** for styling
- **Framer Motion** for animation
- **Three.js / @react-three/fiber** for the hero 3D scene
- **HubSpot CRM** for lead capture via `/api/leads`

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Lead Capture

Contact form submissions (main form + popup) POST to `/api/leads`, which upserts a contact and creates a deal in HubSpot. Configuration:

```bash
# .env.local
HUBSPOT_ACCESS_TOKEN=your-private-app-token
```

The token needs CRM write scope. Custom contact properties (`lead_service`, `lead_message`, `lead_timeline`, `lead_budget`, `lead_source`, `lead_page`) are auto-created on first submission.

If the API is unavailable, the main contact form falls back to opening the visitor's email client with a pre-filled message.

## Editing Site Content

- **Projects** — `src/lib/portfolio.ts` (shown in the "Selected Work" section; stats are derived automatically)
- **Products** — `src/components/Products.tsx`
- **Contact topics/budgets** — `src/components/Contact.tsx`
- **Navigation** — `src/components/Navbar.tsx` and `src/components/Footer.tsx`
- **Theme colors / fonts** — `src/app/globals.css` (`@theme` block)

## Scripts

```bash
npm run dev     # start dev server
npm run build   # production build
npm run start   # serve production build
npm run lint    # eslint
```
