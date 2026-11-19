// reason.ts — mirrors the rule order of checkAvailability in src/availability.js.
// The authoritative status always comes from checkAvailability; this function only
// classifies WHY, for explanation purposes.

export type ReasonCode =
  | 'INVALID_TIME'
  | 'PAST_TIME'
  | 'TOO_LONG'
  | 'BLOCKED'
  | 'OVERLAP'
  | 'FREE';

export interface ReasonRoom {
  id: string;
  blocked: boolean;
}

export interface ReasonRequest {
  start: string;
  end: string;
}

export interface ReasonBooking {
  start: string;
  end: string;
}

export function getReasonCode(
  room: ReasonRoom,
  bookings: ReasonBooking[],
  request: ReasonRequest,
  now: Date
): ReasonCode {
  const start = new Date(request.start);
  const end = new Date(request.end);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 'INVALID_TIME';

  if (start >= end) return 'INVALID_TIME';
  if (start < now) return 'PAST_TIME';

  if ((end.getTime() - start.getTime()) / 60000 > 120) return 'TOO_LONG';

  if (room.blocked) return 'BLOCKED';

  for (const b of bookings) {
    const bs = new Date(b.start);
    const be = new Date(b.end);
    if (Number.isNaN(bs.getTime()) || Number.isNaN(be.getTime())) return 'OVERLAP';
    if (start < be && end > bs) return 'OVERLAP';
  }

  return 'FREE';
}
