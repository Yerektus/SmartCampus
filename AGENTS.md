## Project
Smart Campus room availability checker; one room, fictional data.
Live path: src/App.tsx -> src/features/room-availability/index.ts -> components/AvailabilityChecker.tsx -> src/availability.js

## Constraints
No backend, login, or booking creation.
Do not redesign or replace the existing UI in AvailabilityChecker.tsx.
No secrets: never add API keys, credentials, tokens, or commit .env or private material.
No external deployments: do not publish or push to a remote without human approval.
Preserve acceptance criteria AC1–AC5 (see Acceptance criteria below).

## Acceptance criteria
AC1: start must be before end, and not in the past; an invalid or empty start or end date is rejected. (src/availability.js:18; tests TC-01, TC-02, TC-10)
AC2: maximum booking duration is 120 minutes. (src/availability.js:22; tests TC-03, TC-04)
AC3: a blocked room is unavailable. (src/availability.js:25; test TC-05)
AC4: requested slot must not overlap an existing booking; a booking that starts exactly when another ends (or ends exactly when another starts) is allowed; a booking with an unreadable date makes the room unavailable. (src/availability.js:30; tests TC-06, TC-07, TC-08, TC-11)
AC5: the bookings array passed in must not be mutated. (src/availability.js:28; test TC-09)

## Engineering rules
Prefer pure functions and minimal changes; use at most 2 justified patterns.
Do not mutate booking fixtures; keep responsive UI feedback.
Do not delete or weaken existing tests in tests/availability.test.js.

## Commands
npm install
npm test            # vitest run
npm run lint        # eslint .
npm run typecheck   # tsc --noEmit -p tsconfig.app.json
npm run build       # vite build
npm run dev

## Verification
Before proposing a change for acceptance, run and show output for ALL of:
  npm test, npm run lint, npm run typecheck, npm run build.
Add focused regression tests for any behavior change.
Report changed files, rationale, and the exact command output as evidence.
Do not consider a change accepted until a human reviewer approves it before merge or acceptance.
