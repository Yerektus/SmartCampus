// src/availability.js - BUG-A and BUG-B are fixed; guarded by tests TC-07, TC-08, TC-09.
export const MAX_DURATION_MIN = 120;

/**
 * Checks whether a room is available for the requested time slot.
 * @param {{id: string, blocked: boolean}} room
 * @param {{start: string, end: string}[]} bookings  existing bookings (must NOT be modified)
 * @param {{start: string, end: string}} request
 * @param {Date} now  fixed "current time" (injected for deterministic tests)
 * @returns {'Available' | 'Unavailable'}
 */
export function checkAvailability(room, bookings, request, now) {
  const start = new Date(request.start);
  const end = new Date(request.end);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 'Unavailable';

  // AC1: start must be before end, and not in the past
  if (start >= end) return 'Unavailable';
  if (start < now) return 'Unavailable';

  // AC2: maximum duration 120 minutes
  if ((end - start) / 60000 > MAX_DURATION_MIN) return 'Unavailable';

  // AC3: blocked room
  if (room.blocked) return 'Unavailable';

  // AC5: bookings is only read, never sorted or mutated (former BUG-B, test TC-09).

  // AC4: overlap check
  for (const b of bookings) {
    const bs = new Date(b.start);
    const be = new Date(b.end);
    if (Number.isNaN(bs.getTime()) || Number.isNaN(be.getTime())) return 'Unavailable';
    // AC4: touching endpoints do not conflict, comparison is strict < and > (former BUG-A, tests TC-07, TC-08).
    if (start < be && end > bs) return 'Unavailable';
  }

  return 'Available';
}
