# Crescendo Consulting

Music consulting and booking application — Phase 1 MVP.

Crescendo connects **musicians, producers, technicians, venues, and other
music-industry service providers**. Members sign up, build a verified
profile, discover each other, and — once both sides accept a connection —
message and schedule an in-person meetup at a **neutral, public space**
before doing business together.

See [`docs/PRODUCT_OVERVIEW.md`](docs/PRODUCT_OVERVIEW.md) for the full
phase roadmap (Phase 2: financial training & music consulting, Phase 3:
super-regional booking rollout) and a list of what's stubbed for Phase 1
versus what's needed for production.

## Repository layout

```
backend/   Node.js + TypeScript + Express + Prisma/PostgreSQL API
app/       Expo (React Native + React Native Web) app — iOS, Android, and
           web/desktop from one codebase
docs/      Product and technical documentation
```

## Quick start

### Backend API

```bash
cd backend
cp .env.example .env        # point DATABASE_URL at your Postgres instance
npm install
npx prisma migrate dev      # creates schema + applies migrations
npm run prisma:seed         # optional: sample users, profiles, meeting spaces
npm run dev                 # http://localhost:4000
```

Run the test suite (uses its own database — point `DATABASE_URL` at a
disposable one first):

```bash
npm test
```

### App (mobile + web/desktop)

```bash
cd app
npm install
npm run web       # desktop/browser
npm run ios       # requires macOS + Xcode, or use Expo Go
npm run android   # requires Android Studio, or use Expo Go
```

The app reads the API URL from `app.json`'s `expo.extra.apiUrl`
(defaults to `http://localhost:4000/api`).

## Core Phase 1 features

- **Sign up & role selection** — Musician, Producer, Technician, Venue, or
  Service Provider; optional "signing up as a business" flag.
- **Identity/business verification** — documents are submitted and queued
  for admin review by default (`VERIFICATION_PROVIDER=MANUAL`). An ID.me
  integration is scaffolded and can be switched on once production
  credentials exist — see `backend/src/modules/verification/providers/IdMeProvider.ts`.
  Every account shows a verification badge (Not verified / Pending /
  Verified / Rejected).
- **Discovery** — search and filter by role, city, genre, and skill.
- **Connections & messaging** — send a connection request, the recipient
  accepts or declines, then both sides can message in-app.
- **Meet at a neutral space** — once a connection is accepted, either side
  can propose meeting at a public, neutral venue (coworking space, café,
  rehearsal studio, etc.) instead of a private address; the other side
  accepts the proposal.
- **Bookings** — simple session/gig booking requests between two accounts,
  with provider confirm/decline.
- **Admin review queue** — admins list pending verification requests and
  approve or reject them.
