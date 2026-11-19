// snapshot.ts — pure helper for FIX 2: builds the explain request from the
// snapshot captured when "Check availability" was clicked, so the explanation
// always matches the displayed result even if the form inputs change after.

import { getReasonCode } from './reason';

export interface ResultSnapshot {
  blocked: boolean;
  start: string;
  end: string;
  result: 'Available' | 'Unavailable';
}

export function buildExplainRequest(
  snapshot: ResultSnapshot,
  now: Date,
  bookings: { start: string; end: string }[],
  roomLabel: string
): { input: ExplainRequestInput | null } {
  const room = { id: roomLabel, blocked: snapshot.blocked };
  const reasonCode = getReasonCode(
    room,
    bookings,
    { start: snapshot.start, end: snapshot.end },
    now
  );
  const isAvailable = snapshot.result === 'Available';
  if ((reasonCode === 'FREE') !== isAvailable) {
    return { input: null };
  }
  return {
    input: {
      roomLabel,
      start: snapshot.start,
      end: snapshot.end,
      isAvailable,
      reasonCode,
    },
  };
}

export interface ExplainRequestInput {
  roomLabel: string;
  start: string;
  end: string;
  isAvailable: boolean;
  reasonCode: string;
}
