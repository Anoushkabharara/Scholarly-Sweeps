# Scholarly Sweeps

A dorm-cleaning marketplace for UTD students, built as an end-to-end product
case study: real survey research → product decisions → a working full-stack
demo with real accounts, a cleaner marketplace, and a booking flow.

**Live demo:** https://scholarly-sweeps.vercel.app
**Stack:** Next.js 14 (App Router) · Express · JWT auth · bcrypt

> This is a demo. Bookings are simulated — no payment is processed and no
> cleaner is actually dispatched.

## The product

Scholarly Sweeps matches UTD students with a nearby, rated cleaner for their
dorm room, on a schedule that works for both sides. The booking flow is a
real marketplace, not a single-vendor checkout:

**Location → Cleaning type → Choose a cleaner → Supplies & notes → Add-ons →
Schedule → Checkout → Confirmed**

Along the way: package cards show exactly what's included before you commit
to extras, cleaners are shown with star ratings and review counts, the
calendar only offers days that cleaner actually works, and add-ons are
ranked by how many students said they wanted them.

Accounts are real — signup and login with bcrypt-hashed passwords and signed
session cookies, plus an account page showing your booking history.

## The research

This started as a Marketing 3300 Honors group project, with primary research
on UTD's own student population:

- **56 survey respondents** (89.7% freshmen, 78.9% living in dorms)
- **47.3%** cited lack of time to clean as their top reason to hire a service
- **32.2%** wanted more thorough cleaning than they do themselves
- **69%** of respondents were unemployed with **$0–$100/month** disposable income
- **61%** wanted laundry as an add-on service — by far the most requested
- Competitor benchmarking against a local service (North Texas Cowboy
  Cleaners), which charges $115+/week for a full apartment — this project's
  per-room pricing model ($25–35/mo) targets a different unit of service
  entirely, not just a discount on the same offering
- Open-ended feedback was blunt: "lower your prices"

The original deliverable was a static pitch deck and a spreadsheet financial
model. This project turns that research into an actual product.

## From insight to decision

Every product decision in the app ties back to a specific finding, not just
intuition:

| Finding | Decision |
|---|---|
| 47.3% cite lack of time (vs. 32.2% wanting a better clean) | Landing page hero leads with time saved, not cleaning quality |
| 89.7% of interested respondents are freshmen | Copy and "how it works" section written for someone booking their *first* cleaning service, not a repeat customer |
| Pricing responses split hard between "too expensive" and "willing to pay" | Kept $25/mo as the anchor price instead of discounting it — added a separate promo tier for the price-sensitive segment (see roadmap) rather than eroding the whole product's margin |
| Laundry requested by 61% of students, next-highest add-on at 43.9% | Laundry ships first as an add-on; low-demand items (carpet cleaning, eco-friendly options, ~2% each) were cut from scope entirely |
| Students wanted clarity on what a "clean" actually includes | Added expandable "See what's included" on every package card, and a dedicated inclusions list inside the booking flow before add-ons are even shown |
| Competitor pricing is per-unit (whole apartment), not per-room | Positioned Scholarly Sweeps as a per-room service — the point of difference is a smaller, cheaper unit of service, not a discount on the same thing |

## How this was built

The project went through several real iterations rather than one shot:

1. **Wireframe pass** — a deliberately low-fidelity, gray-box version of the
   booking flow and dashboard, built first to validate the flow and data
   model before investing in visual design.
2. **Marketplace booking flow** — expanded from a simple "pick a package and
   pay" flow into a real marketplace: address entry, cleaner selection with
   ratings, supply negotiation, availability-aware scheduling, and a proper
   checkout.
3. **Real authentication** — signup/login with bcrypt password hashing and
   signed JWT session cookies, plus a booking history tied to the logged-in
   account.
4. **Visual design pass** — a full pastel-blue design system (chosen to
   evoke cleanliness), custom mop-icon logo, and a serif/sans type pairing
   (Fraunces + Plus Jakarta Sans), replacing the initial wireframe styling.
5. **Product dashboard** — a separate `/dashboard` view that turns the
   original survey data into charts, each paired with the decision it
   drove — the "why," not just the "what."

### Architecture

```
scholarly-sweeps/
├── server/          Express REST API (Node.js)
│   ├── index.js         routes: /api/packages, /api/addons, /api/cleaners,
│   │                    /api/survey, /api/bookings, /api/auth/*
│   ├── db.js             JSON-file-backed users + bookings store
│   └── data/*.json       reference data, including the real survey stats
└── client/          Next.js 14 (App Router)
    ├── app/page.js          landing page
    ├── app/login/           login
    ├── app/signup/          signup
    ├── app/account/         profile + booking history
    ├── app/book/            8-step marketplace booking flow
    ├── app/dashboard/       research → decision → roadmap case study
    ├── components/AuthContext.js   shared auth state
    └── next.config.js       proxies /api/* to the Express server
```

**A deliberate tradeoff:** user accounts and bookings are stored in flat
JSON files rather than a SQL database. SQLite was tried first but requires
native compilation that's flaky across hosting environments; a real SQL
database (Postgres) would need a separately hosted instance. For a
portfolio demo, a dependency-free JSON store is the more reliable choice —
the known limitation is that this data resets if the API server redeploys.

**Deployed on:**
- **Vercel** — the Next.js frontend
- **Railway** — the Express API

## Run it locally

Two terminals:

```bash
# Terminal 1 — API
cd server
npm install
npm run dev        # http://localhost:4000

# Terminal 2 — frontend
cd client
npm install
npm run dev         # http://localhost:3000
```

Visit `http://localhost:3000`.

## Deploy

- **API → Railway**: root directory `server`. Environment variables:
  - `JWT_SECRET` — any long random string
  - `NODE_ENV` → `production`
  - `FRONTEND_ORIGIN` → your deployed frontend URL
- **Frontend → Vercel**: root directory `client`. Environment variable:
  - `NEXT_PUBLIC_API_ORIGIN` → your deployed API URL

## What's next

Prioritized using the same research this project is built on:

- **Now** — cleaner marketplace + add-ons (shipped in this demo)
- **Next** — a discounted promo pricing tier for the price-sensitive segment
  identified in the pricing survey, without touching the $25 anchor price
- **Later** — a direct partnership with UTD housing for distribution at
  move-in, the single highest-intent moment for this audience

## Skills this project demonstrates

- Translating primary research (a real 56-respondent survey) into specific,
  defensible product decisions
- Designing and building a full marketplace flow, not just a checkout form
- Real authentication (bcrypt, JWT sessions) — not a fake "logged in" toggle
- Full-stack ownership: REST API design, frontend state management, and
  production deployment across two separate platforms
- Visual design system work: palette, typography, and component design
