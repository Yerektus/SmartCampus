# Smart Campus Room Availability Checker

Checks availability for a single fictional room (A-101). No login, no database, no booking creation — availability only.

## Requirements

- Node 20 or newer

## Setup

```sh
npm ci
```

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the dev server |
| `npm test` | Run the test suite (vitest) |
| `npm run lint` | Lint the project (eslint) |
| `npm run typecheck` | Type-check without emitting (tsc) |
| `npm run build` | Build for production (vite) |

## Folder layout

Live path (what the app actually runs):

```
src/App.tsx -> src/features/room-availability/index.ts -> components/AvailabilityChecker.tsx -> src/availability.js
```

Tests: `tests/availability.test.js`

The following files exist in `src/features/room-availability/` but are **not on the live path**: `types.ts`, `data/rooms.ts`, `components/RoomSelector.tsx`, `components/ResultCard.tsx`, `components/TimeInputs.tsx`, `components/AvailabilityTimeline.tsx`.

See [AGENTS.md](AGENTS.md) for agent rules and acceptance criteria.
