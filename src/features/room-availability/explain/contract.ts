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

function claimsWrongAvailability(text: string, isAvailable: boolean): boolean {
  const t = text.toLowerCase();
  if (isAvailable) {
    return /\bnot available\b|\bunavailable\b|\bcannot be booked\b/.test(t);
  }
  return /\bavailable\b/.test(t) && !/\bnot available\b|\bunavailable\b/.test(t);
}

export function validateExplanation(value: unknown, isAvailable: boolean): ExplanationResult {
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
  if (claimsWrongAvailability(text, isAvailable)) {
    return { ok: false, error: 'Explanation contradicts the confirmed availability status.' };
  }
  return { ok: true, value: { explanation: text } };
}
