# Scholarly Sweeps — Product Case Study (Wireframe)

A working demo booking flow + product dashboard for a UTD dorm/apartment cleaning
service, built as a technical PM/APM portfolio piece. Based on original market
research from a Marketing 3300 Honors group project (survey of 56 UTD students,
competitor analysis, pricing tests).

**This is a wireframe** — deliberately low-fidelity (grayscale, dashed borders) so the
flow and data model are the focus. Visual design is the next pass.

No real payments are processed and no cleaner is dispatched. Bookings are stored
in-memory on the API and reset on server restart.

## What this demonstrates

- **Product thinking**: every chart on `/dashboard` is tied to a specific decision
  (pricing tier, add-on prioritization, marketing angle), not just a stat.
- **Technical fluency**: a real REST API (Express) consumed by a real frontend
  (Next.js App Router), not a static mockup — you can actually complete a booking.
- **Real auth**: signup/login with bcrypt-hashed passwords and signed JWT session
  cookies — not a fake "logged in" toggle.
- **Data-driven roadmap**: add-on demand percentages and pricing sensitivity data
  directly drive the "Now / Next / Later" roadmap on the dashboard.

## Auth

- Passwords are hashed with bcrypt, never stored in plaintext.
- Sessions are a signed JWT stored in an httpOnly cookie (not readable by JS,
  not vulnerable to basic XSS token theft).
- User accounts and bookings are stored in flat JSON files
  (`server/data/users.json`, `server/data/bookings.json`) rather than a SQL
  database — this avoids native-module build issues across different hosting
  environments. **Known limitation**: on most hosting platforms (including
  Railway's default filesystem) these files reset on redeploy, since the
  filesystem isn't persistent. Fine for a demo/portfolio piece; swap in
  Postgres or MongoDB Atlas if you want accounts to survive redeploys.

## Booking flow

The `/book` flow is a marketplace, not a single-vendor checkout:

1. **Location** — dorm address (free text)
2. **Cleaning type** — Standard / Deep / Move-Out, dorm-only pricing
3. **Choose a cleaner** — name, star rating, review count, whether they bring supplies
4. **Supplies & notes** — who brings supplies (+$5 if the cleaner does), free-text notes
5. **Add-ons** — shows what's included in the chosen package first, then optional
   extras (laundry, window cleaning, dishes, organizing) ranked by survey demand
6. **Schedule** — a 14-day calendar filtered to the selected cleaner's actual
   availability, then time slots
7. **Checkout** — name/phone/email (prefilled if logged in), full order summary, total
8. **Confirmed** — booking code from the API

## Architecture

```
scholarly-sweeps/
├── server/          Express REST API (Node.js)
│   ├── index.js         routes: /api/packages, /api/addons, /api/cleaners,
│   │                    /api/survey, /api/bookings, /api/auth/*
│   ├── db.js             JSON-file-backed users + bookings store
│   └── data/*.json       mock reference data + generated user/booking data
└── client/          Next.js 14 (App Router)
    ├── app/page.js          landing page
    ├── app/login/page.js    login
    ├── app/signup/page.js   signup
    ├── app/account/page.js  profile + booking history
    ├── app/book/page.js     8-step marketplace booking flow (the working prototype)
    ├── app/dashboard/page.js  PM case study: research → decision → roadmap
    ├── components/AuthContext.js  shared auth state
    └── next.config.js       proxies /api/* to the Express server
```

## Run locally

Two terminals:

```bash
# Terminal 1 — API
cd server
npm install
npm run dev        # runs on http://localhost:4000

# Terminal 2 — frontend
cd client
npm install
npm run dev         # runs on http://localhost:3000
```

Visit `http://localhost:3000`.

## Deploy

- **API → Railway or Render**: point it at the `server/` folder, it just needs
  `npm install && npm start`. Set environment variables:
  - `JWT_SECRET` — any long random string (used to sign session cookies)
  - `FRONTEND_ORIGIN` — your deployed frontend URL (e.g. `https://scholarly-sweeps.vercel.app`)
  - `NODE_ENV=production`
  Note the deployed API URL once it's live.
- **Frontend → Vercel**: import the `client/` folder as the project root, and set
  the environment variable `NEXT_PUBLIC_API_ORIGIN` to your deployed API URL.

## Roadmap for the next pass

1. Real visual design (this repo is intentionally wireframe-only for now).
2. Persist bookings in a real database (Postgres/Mongo) instead of in-memory.
3. Auth (so "my bookings" is real per user).
4. A PRD.md alongside this README, formalizing the requirements this prototype
   is testing.
