// contract.ts — validation for inputs sent to the (mock) LLM adapter and for
// explanations returned by it. Everything here is defensive: the adapter output
// is untrusted.

import type { ReasonCode } from './reason';

export const REASON_CODES: ReasonCode[] = [
  'INVALID_TIME',
  'PAST_TIME',
  'TOO_LONG',
  'BLOCKED',
  'OVERLAP',
  'FREE',
];

export interface ExplainInput {
  roomLabel: string;
  start: string;
  end: string;
  isAvailable: boolean;
  reasonCode: ReasonCode;
}

export type ValidationResult =
  | { ok: true; value: ExplainInput }
  | { ok: false; error: string };

export function isValidReasonCode(code: unknown): code is ReasonCode {
  return typeof code === 'string' && (REASON_CODES as string[]).includes(code);
}

export function validateExplainInput(value: unknown): ValidationResult {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return { ok: false, error: 'Input must be an object.' };
  }
  const v = value as Record<string, unknown>;

  const { roomLabel, start, end, isAvailable, reasonCode } = v;

  if (typeof roomLabel !== 'string' || roomLabel.length === 0) {
    return { ok: false, error: 'roomLabel is required.' };
  }
  if (roomLabel.length > 40) {
    return { ok: false, error: 'roomLabel must be at most 40 characters.' };
  }
  if (!/^[A-Za-z0-9 -]+$/.test(roomLabel)) {
    return { ok: false, error: 'roomLabel contains forbidden characters.' };
  }

  if (typeof start !== 'string' || start.length === 0) {
    return { ok: false, error: 'start is required.' };
  }
  if (start.length > 30) {
    return { ok: false, error: 'start must be at most 30 characters.' };
  }
  if (Number.isNaN(new Date(start).getTime())) {
    return { ok: false, error: 'start is not a valid date string.' };
  }

  if (typeof end !== 'string' || end.length === 0) {
    return { ok: false, error: 'end is required.' };
  }
  if (end.length > 30) {
    return { ok: false, error: 'end must be at most 30 characters.' };
  }
  if (Number.isNaN(new Date(end).getTime())) {
    return { ok: false, error: 'end is not a valid date string.' };
  }

  if (typeof isAvailable !== 'boolean') {
    return { ok: false, error: 'isAvailable must be a boolean.' };
  }

  if (!isValidReasonCode(reasonCode)) {
    return { ok: false, error: 'reasonCode is not a known reason code.' };
  }

  if ((reasonCode === 'FREE') !== isAvailable) {
    return { ok: false, error: 'isAvailable disagrees with reasonCode (FREE must mean available).' };
  }

  return {
    ok: true,
    value: { roomLabel, start, end, isAvailable, reasonCode },
  };
}

export interface Explanation {
  explanation: string;
}

export type ExplanationResult =
  | { ok: true; value: Explanation }
  | { ok: false; error: string };

function sentenceCount(text: string): number {
  const trimmed = text.trim();
  if (trimmed.length === 0) return 0;
  const matches = trimmed.match(/[.!?]+/g);
  return matches ? matches.length : 1;
}

function extractClockTimes(s: string): string[] {
  return s.match(/\b\d{1,2}:\d{2}\b/g) ?? [];
}

function claimsWrongAvailability(
  text: string,
  isAvailable: boolean,
  times?: { start: string; end: string }
): boolean {
  const t = text.toLowerCase();
  if (isAvailable) {
    if (
      /\bnot available\b|\bunavailable\b|\bbooked\b|\btaken\b|\boccupied\b|\boverlap\b|\bblocked\b|\bcan'?t\b|\bcannot\b|\bnot possible\b/.test(
        t
      )
    ) {
      return true;
    }
  } else {
    const stripped = t.replace(/\bnot available\b/g, '').replace(/\bunavailable\b/g, '');
    if (/\bavailable\b/.test(stripped)) return true;
    if (/\bfree\b|\bgo ahead\b|\bcan book\b|\bproceed\b/.test(t)) return true;
  }
  // Invented personal details: a personal title or a clock time that does not
  // appear in the checked start/end is fabricated, not derived from the facts.
  if (/\b(?:prof|dr|mr|ms|mrs)\./.test(t)) return true;
  const allowed = new Set(
    times
      ? [times.start, times.end].flatMap((iso) =>
          extractClockTimes(iso.includes('T') ? iso.slice(iso.indexOf('T') + 1) : iso)
        )
      : []
  );
  for (const tm of extractClockTimes(t)) {
    if (!allowed.has(tm)) return true;
  }
  return false;
}

export function validateExplanation(
  value: unknown,
  isAvailable: boolean,
  times?: { start: string; end: string }
): ExplanationResult {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return { ok: false, error: 'Output must be an object.' };
  }
  const explanation = (value as Record<string, unknown>).explanation;

  if (typeof explanation !== 'string') {
    return { ok: false, error: 'Explanation must be a string.' };
  }
  const text = explanation.trim();
  if (text.length === 0) {
    return { ok: false, error: 'Explanation must not be empty.' };
  }
  if (text.length > 280) {
    return { ok: false, error: 'Explanation must be at most 280 characters.' };
  }
  if (sentenceCount(text) > 2) {
    return { ok: false, error: 'Explanation must be at most 2 sentences.' };
  }
  if (claimsWrongAvailability(text, isAvailable, times)) {
    return { ok: false, error: 'Explanation contradicts the confirmed availability status.' };
  }
  return { ok: true, value: { explanation: text } };
}
