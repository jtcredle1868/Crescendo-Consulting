# Crescendo Consulting — Product Overview

## Phase 1 (this build): Networking MVP

Goal: let musicians, producers, technicians, venues, and other
music-industry service providers find each other, verify who they're
dealing with, and take the relationship offline safely.

| Capability | Status |
|---|---|
| Sign up with role (Musician / Producer / Technician / Venue / Service Provider) | Done |
| Business flag + business name | Done |
| Identity/business verification submission + admin review queue | Done (manual review) |
| ID.me verification | Scaffolded, not wired to production credentials — see below |
| Discovery / search (role, city, genre, skill, keyword) | Done |
| Connection requests (send / accept / decline) | Done |
| In-app messaging (accepted connections only) | Done |
| Neutral/public meeting space directory | Done, seeded with sample venues |
| Meeting proposals tied to a connection | Done |
| Booking requests (session/gig) | Done |
| Admin verification review | Done |
| Mobile apps (iOS/Android) | Done via Expo — needs an EAS build to ship to app stores |
| Desktop | Done as a responsive web app (Expo web export); an Electron/Tauri wrapper can reuse the same web build if a packaged desktop binary is wanted later |

## What's intentionally stubbed for Phase 1, and how to complete it

This section exists so "what's missing" is explicit rather than discovered
later.

- **ID.me identity/business verification.** `VERIFICATION_PROVIDER=MANUAL`
  is the default and requires no third-party account — an admin reviews
  submitted documents by hand. `IdMeProvider`
  (`backend/src/modules/verification/providers/IdMeProvider.ts`) is
  scaffolded with the OAuth flow documented inline; it fails closed (falls
  back to the manual queue) until `IDME_CLIENT_ID`, `IDME_CLIENT_SECRET`,
  and `IDME_REDIRECT_URI` are set and the authorization-code exchange is
  implemented. Get production credentials at https://developers.id.me.
- **Document uploads.** Verification documents are submitted as URLs
  (the member uploads to any file host with link sharing and pastes the
  link). There's no built-in object storage yet. To add real uploads,
  wire an S3/Cloudflare R2 bucket and a presigned-upload endpoint, then
  point the app's document picker at it instead of a URL text field.
  `VerificationDocument.fileUrl` already accepts any URL, so this is a
  frontend + storage change, not a schema change.
- **Push notifications, email.** Not implemented. Add `expo-notifications`
  for push and a transactional email provider (Postfix/SendGrid/Resend)
  for verification-decision and connection-request emails when ready.
  In the meantime, the app polls (`refetchInterval`) for new messages.
- **Payments.** No payment processing. Booking `rate` is informational
  only. Add Stripe Connect when the business is ready to take a cut of
  bookings.
- **App store distribution.** The Expo app runs in Expo Go / dev builds
  today. Ship to the App Store / Play Store with `eas build` +
  `eas submit` (see `app/AGENTS.md`).

## Phase 2: Financial training & music consulting

Adds paid consulting content and tools on top of the Phase 1 network:

- Financial literacy / royalty education content for musicians.
- 1:1 or group consulting bookings (reuses the Phase 1 `Booking` model —
  a consulting session is just a booking with a Service Provider).
- Possibly gated content requiring a paid membership tier.

## Phase 3: Super-regional booking rollout

Scales the booking marketplace across a super-region (e.g. a multi-state
touring circuit):

- Venue booking calendars and availability management.
- Multi-city discovery and tour routing.
- Regional admin/moderation roles beyond the single global `ADMIN` role
  Phase 1 ships with.

## Data model

See `backend/prisma/schema.prisma` for the source of truth. Core entities:
`User`, `Profile`, `VerificationRequest`/`VerificationDocument`,
`Connection`, `Message`, `MeetingSpace`, `MeetingProposal`, `Booking`.
