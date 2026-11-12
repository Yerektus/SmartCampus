# Project memory

## Product intent & audience

- Smart Campus Room Availability Checker: checks availability for a single room using fictional data.
- Frontend-only; no backend, login, or booking creation.
- Audience: developers/maintainers performing agent-readiness audits and supervised agent edits.

## Brand personality & voice

- Documentation voice is cautious, evidence-based, exact-citation style (file:line).
- AGENTS.md tone is directive and constraint-oriented.

## Visual design & UX direction

- App composed from modular feature components: `AvailabilityChecker.tsx`, `RoomSelector.tsx`, `ResultCard.tsx`, `TimeInputs.tsx`, `AvailabilityTimeline.tsx`.
- UI must remain responsive (AGENTS.md engineering rule).
- `AvailabilityChecker.tsx` is explicitly protected from redesign.

## Decisions, constraints & rationale

- Stack: Vite + React (TS/JSX) + Tailwind + Lucide React + vitest + eslint + tsc.
- Path alias `@/` -> `src/`; avoid deep relative imports.
- Core availability logic lives in `src/availability.js` (plain JS, not TS) — causes TS7016 typecheck failure under strict mode.
- Feature module layout: `src/features/room-availability/` with `index.ts`, `components/`, `data/rooms.ts`, `types.ts`.
- Shared utils under `src/shared/utils/formatMinutes.ts`.
- Tests: `tests/availability.test.js` (9 tests, vitest).
- AGENTS.md constraints: pure functions, ≤2 justified patterns, no fixture mutation, preserve tests, no backend/login/booking, no redesigning AvailabilityChecker.
- Acceptance criteria labels AC1–AC5 exist only as inline comments in `availability.js`; AC6 is referenced in AGENTS.md but defined nowhere.
- Reproducibility: `package-lock.json` present (lockfileVersion 3); direct deps use caret ranges; no `engines` field; no CI.

## Open questions & assumptions

- Whether AC1–AC6 inline comments count as a readable spec (judged insufficient).
- No README exists; full repository layout is undocumented outside AGENTS.md's partial path.
- Typecheck blocker unresolved: need `.d.ts` for `@/availability`, rename to `.ts`, or adjust tsconfig.
- No human review gate in AGENTS.md — only self-report obligation.
- AGENTS.md command list omits lint, typecheck, build despite scripts existing.
- Current readiness verdict: Level 2 (supervised changes allowed; gaps block Level 3 autonomy).